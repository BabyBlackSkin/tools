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
    connect: (config) => {
        return ipcRenderer.invoke('SSH:connect', config)
    },
    close: () => {
        return ipcRenderer.invoke('SSH:close')
    }
})
