import { BrowserWindow, dialog, shell, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

// 自动下载更新
autoUpdater.autoDownload = false
// 退出时自动安装更新
autoUpdater.autoInstallOnAppQuit = false

export default (win) => {
    const checkForUpdates = (manual = false) => {
        return new Promise((resolve, reject) => {
            autoUpdater.checkForUpdates().then((updateInfo) => {
                resolve()
            }).catch((error) => {
                console.error('Error checking for updates:', error)
                reject(error)
            })

            if (manual) {
                dialog.showMessageBox({
                    type: 'info',
                    title: '检查更新',
                    message: '正在检查更新...'
                })
            }
        })

    }

    // checkForUpdates()

    // 监听来自渲染进程的手动检查更新请求
    ipcMain.handle('app:checkForUpdate', async () => {
        return await checkForUpdates(true)
    })
}
