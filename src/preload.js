// 在上下文隔离启用的情况下使用预加载
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    deskTop: (params) => {
        console.log(params)
        ipcRenderer.invoke('getSqlLite').then(res=>{
            console.log(res)
        })
        return true
    }
})

contextBridge.exposeInMainWorld('sqlite', {
    execute: (sql) => {
        return ipcRenderer.invoke('SQLite:execute', sql)
    }
})


contextBridge.exposeInMainWorld('ssh', {
    operation: (data) => {
        return ipcRenderer.invoke('ssh:operation', data)
    }
})

// 自动更新相关API
contextBridge.exposeInMainWorld('app', {
    getVersion: () => {
        return ipcRenderer.invoke('setting:getVersion')
    },
    checkForUpdate: () => {
        return ipcRenderer.invoke('app:checkForUpdate')
    },
})

// 自动更新相关API
contextBridge.exposeInMainWorld('updater', {
    checkForUpdates: () => {
        return ipcRenderer.invoke('check-for-updates')
    },
    downloadUpdate: () => {
        return ipcRenderer.invoke('download-update')
    },
    installUpdate: () => {
        return ipcRenderer.invoke('install-update')
    },
    // 监听更新事件
    onUpdateAvailable: (callback) => {
        ipcRenderer.on('update-available', callback)
    },
    onUpdateDownloaded: (callback) => {
        ipcRenderer.on('update-downloaded', callback)
    },
    onUpdateNotAvailable: (callback) => {
        ipcRenderer.on('update-not-available', callback)
    },
    onUpdateError: (callback) => {
        ipcRenderer.on('update-error', callback)
    },
    onDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', callback)
    },
    // 移除监听器
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel)
    }
})
