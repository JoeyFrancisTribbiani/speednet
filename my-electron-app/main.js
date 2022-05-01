/*
 * @Author: Joey
 * @Date: 2022-04-24 16:21:30
 * @LastEditors: Joey
 * @LastEditTime: 2022-04-26 15:08:01
 * @FilePath: \my-electron-app\main.js
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const exec = require('child_process').execFile
var COREVPN_PROCESS_PID = 0
var COREVPN_PROCESS

function handleStartVpn(event, config) {
    const core = path.join(__dirname, './corevpn.exe');

    const out = fs.openSync('./out.log', 'a'); // Capture output stream
    const err = fs.openSync('./out.log', 'a');
    var subprocess;
    // subprocess = exec(core, ['-f', './config.yaml'], function (err, data) { if (err) { throw err; } console.log(data.toString()); });
    // subprocess = spawn(core, ['-f', './config.yaml'], { detached: true, stdio: ['ignore', out, err] }); // Detachable
    subprocess = spawn(core, ['-f', './config.yaml'], { stdio: ['ignore', out, err] }); // Detachable
    // subprocess.unref(); // detach from parent process
    COREVPN_PROCESS_PID = subprocess.pid
    COREVPN_PROCESS = subprocess

    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    var game = win.getTitle()
    win.setTitle(game + ' - 加速中')
}
function handleStopVpn(event, config) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    var title = win.getTitle()
    var game = title.replace(' - 加速中', '')
    win.setTitle(game)

    COREVPN_PROCESS.kill('SIGINT') // kill the child process and its children
    const core = path.join(__dirname, './corevpn.exe');
    const out = fs.openSync('./out.log', 'a'); // Capture output stream
    const err = fs.openSync('./out.log', 'a');
    subprocess = spawn(core, ['-off'], { stdio: ['ignore', out, err] }); // Detachable
}


const createWindow = () => {
    const win = new BrowserWindow({
        width: 428,
        height: 926,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}
app.whenReady().then(() => {
    ipcMain.on('start-vpn', handleStartVpn)
    ipcMain.on('stop-vpn', handleStopVpn)
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})