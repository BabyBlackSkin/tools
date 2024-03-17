'use strict'

import {app, BrowserWindow, ipcMain, protocol, Menu} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import sqlite3 from "@/utils/MySQLite";
import tunnelSSH from "@/utils/TunnelSSH";

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const isPackaged = app.isPackaged;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
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
        win.webContents.toggleDevTools();
    }

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    // 隐藏菜单
    Menu.setApplicationMenu(null)

    // 初始化sqlite，其实可以等到用到数据库tab再初始化的
    sqlite3.SQLiteInit()
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

ipcMain.handle('SSH:connect', async (e, config) => {
    return await tunnelSSH.connect(config)
})

ipcMain.handle('SSH:close', async (e) => {
    return await tunnelSSH.close()
})

