'use strict'

import {app, BrowserWindow, ipcMain, protocol, Menu, dialog} from 'electron'
const { fork } = require('child_process');
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import { autoUpdater } from 'electron-updater'
import sqlite3 from "@/utils/MySQLite";
import SysOptResult from "@/utils/SysOptResult";

import {SSH_EVENT} from "@/utils/ssh/constants";
import updater from "@/updater";

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');

Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});

const isPackaged = app.isPackaged;

// 配置自动更新
autoUpdater.autoDownload = false; // 不自动下载，让用户选择

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

let mainWindow;
async function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1205,
        height: 755,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    //每次启动弹出调试框
    if (!isPackaged) {
        mainWindow.webContents.toggleDevTools();
    }

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        mainWindow.loadURL('app://./index.html')
    }
    // 隐藏菜单
    Menu.setApplicationMenu(null)

    // 初始化sqlite，其实可以等到用到数据库tab再初始化的
    sqlite3.SQLiteInit()

    updater(mainWindow, ipcMain);
    // updateHandle()
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    // 解决electron vue 项目中 Failed to fetch extension, trying 4 more times
    // if (isDevelopment && !process.env.IS_TEST) {
    //   // Install Vue Devtools
    //   try {
    //     await installExtension(VUEJS_DEVTOOLS)
    //   } catch (e) {
    //     console.error('Vue Devtools failed to install:', e.toString())
    //   }
    // }
    await createWindow()
})

// 全局错误处理 - 防止未捕获异常导致应用崩溃
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // 不退出应用，只记录错误
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // 不退出应用，只记录错误
});

// 监听应用退出事件，确保SSH连接被正确关闭
app.on('before-quit', async () => {
    try {
        await handleSSHClose();
    } catch (error) {
        console.error('Error closing SSH tunnel on app quit:', error);
    }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}


//这段代码放到main.js最后就行
ipcMain.handle('getSqlLite', () => {
    // console.log()
    return sqlite3.DB_PATH
})


ipcMain.handle('SQLite:execute', async (e, sql) => {
    // debugger
    return await sqlite3.execute(sql)
})

ipcMain.handle('setting:getVersion', (e, sql) => {
    // debugger
    return app.getVersion()
})

let ssh_worker = null;
ipcMain.handle('ssh:operation', (e, data) => {
    console.log('ssh:operation')
    return new Promise((resolve, reject) => {
        try {
            console.log(data)
            if (data.event === SSH_EVENT.CONNECT) {
                handleSSHConnect(data.config).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            } else if (data.event === SSH_EVENT.CLOSE) {
                handleSSHClose().then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            }else{
                reject({result: false, msg: '未知的SSH操作'})
            }
        } catch (error) {
            console.error('SSH operation error:', error);
            reject({result: false, msg: error.message || 'SSH操作失败'})
        }
    })
})

async function handleSSHConnect(config) {
    // 清理之前的连接
    if (ssh_worker) {
        await cleanupWorker();
    }

    return new Promise((resolve, reject) => {
        const workerPath = path.resolve(__dirname, '../src/utils/ssh/worker.js');
        ssh_worker = fork(workerPath);

        // 一次性设置监听器
        ssh_worker.on('message', (msg) => {
            console.log('SSH connect message:', msg);
            if (resolve) {
                resolve(msg);
            }
        });

        ssh_worker.on('error', (error) => {
            console.error('SSH worker error:', error);
            if (reject) {
                reject(error);
            }
        });

        ssh_worker.on('exit', (code, signal) => {
            console.log(`SSH worker exited with code ${code} and signal ${signal}`);
            if (code !== 0 && reject) {
                reject(new Error(`SSH worker exited with code ${code}`));
            }
            cleanupWorker();
        });

        ssh_worker.send({ event: SSH_EVENT.CONNECT, data: config });
    });
}


async function handleSSHClose() {
    if (!ssh_worker) {
        return { result: true, msg: 'No active SSH connection' };
    }

    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.warn('SSH close timeout, kill');
            forceKillWorker();
            resolve({ result: true, msg: 'SSH connection closed' });
        }, 100);

        ssh_worker.once('exit', () => {
            clearTimeout(timeout);
            cleanupWorker();
            resolve({ result: true, msg: 'SSH connection closed gracefully' });
        });

        ssh_worker.send({ event: SSH_EVENT.CLOSE });
    });
}

function cleanupWorker() {
    if (ssh_worker) {
        // 移除所有监听器防止内存泄漏
        ssh_worker.removeAllListeners();
        ssh_worker = null;
    }
}

function forceKillWorker() {
    if (ssh_worker) {
        ssh_worker.kill('SIGTERM');
        cleanupWorker();
    }
}

const sendStatusToWindow = (text) => {
    mainWindow.webContents.send(COMMON_ERROR_LOG, `update msg:${text}`)
}

// 自动更新功能
function updateHandle(mainWindow) {
    autoUpdater.checkForUpdates()
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...')
    })

    autoUpdater.on('update-available', (info) => {
        // 当有新版本可用时，弹窗提示用户
        dialog
            .showMessageBox({
                type: 'info',
                title: '新版本可用',
                message: '有一个可用的新版本，要更新吗',
                buttons: ['是', '否']
            })
            .then((result) => {
                if (result.response === 0) {
                    // 用户选择更新，触发下载和安装
                    autoUpdater.downloadUpdate()
                }
            })
    })

    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Update not available.')
    })

    autoUpdater.on('error', (err) => {
        sendStatusToWindow(err)
    })

    autoUpdater.on('update-downloaded', () => {
        // 处理下载完成的情况
        dialog
            .showMessageBox({
                type: 'info',
                title: '更新下载完成',
                message: '点击确定重启获取最新内容',
                buttons: ['确定']
            })
            .then(() => {
                // 调用 quitAndInstall 来安装更新
                autoUpdater.quitAndInstall()
            })
    })
    autoUpdater.on('download-progress', (progressObj) => {
        sendStatusToWindow(JSON.stringify(progressObj))
    })
}
