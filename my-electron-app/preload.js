/*
 * @Author: Joey
 * @Date: 2022-04-24 16:24:02
 * @LastEditors: Joey
 * @LastEditTime: 2022-04-25 16:50:59
 * @FilePath: \my-electron-app\preload.js
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startVpn: (config) => ipcRenderer.send('start-vpn', config),
    stopVpn: (config) => ipcRenderer.send('stop-vpn', config),
    openAtLogin: (config) => ipcRenderer.send('open-at-login', config),
    appStart: (callback) => ipcRenderer.on('app-start', callback)
})


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})
