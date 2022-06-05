/*
 * @Author: Joey
 * @Date: 2022-04-24 16:21:30
 * @LastEditors: Joey
 * @LastEditTime: 2022-05-26 16:00:19
 * @FilePath: \my-electron-app\main.js
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const exec = require('child_process').execFile
const { SlowBuffer } = require('buffer')
var COREVPN_PROCESS_PID = 0
var COREVPN_PROCESS
// 函数实现，参数单位 毫秒 ；
async function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

// 调用方法；
async function handleStartVpn(event, configList) {
    const config = configList[0]
    console.log("config-----------" + JSON.stringify(config))

    const devman = path.join(__dirname, './DevManView.exe');
    exec(devman, ['/uninstall', 'Clash Tunnel'], function (err, stdout, stderr) { if (err) { throw err; return } console.log(stdout); });
    await wait(3000);

    const core = path.join(__dirname, './corevpn.exe');

    const out = fs.openSync('./out.log', 'a'); // Capture output stream
    const err = fs.openSync('./out.log', 'a');
    var subprocess;
    const configPath = path.join(__dirname, './config.yaml')
    writeConfigFile(configPath, config)
    subprocess = spawn(core, ['-d', __dirname, '-f', configPath], { stdio: ['ignore', out, err], windowsHide: true }); // Detachable

    COREVPN_PROCESS_PID = subprocess.pid
    COREVPN_PROCESS = subprocess

    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    var game = win.getTitle()
    // win.setTitle(game + ' - 加速中' + config.processes)
    win.setTitle(game + ' - 加速中')
}
async function handleStopVpn(event, config) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    var title = win.getTitle()
    var game = title.replace(' - 加速中', '')
    win.setTitle(game)
    const tapctl = path.join(__dirname, './tapctl.exe');
    COREVPN_PROCESS.kill('SIGINT') // kill the child process and its children

}

function handleOpenAtLogin(event, openAtLogin) {
    console.log("path: process.execPath---------------", process.execPath, typeof (process.execPath))
    var execpath = process.execPath
    try {
        app.setLoginItemSettings({
            openAtLogin: openAtLogin, // Boolean 在登录时启动应用
            // openAsHidden: false, // Boolean (可选) mac 表示以隐藏的方式启动应用。~~~~
            // path: execpath,// String (可选) Windows - 在登录时启动的可执行文件。默认为 process.execPath.
            // args: [path.resolve(process.argv[1])] //String Windows - 要传递给可执行文件的命令行参数。默认为空数组。注意用引号将路径换行。
        })
    } catch (error) {
        console.log("path: process.execPath---------------", process.execPath, typeof (process.execPath))
        console.log(error)
    }
}

function writeConfigFile(file, peer) {
    console.log("peer-----------" + JSON.stringify(peer))
    console.log("processess-----------" + peer.processes)
    const processes = peer.processes.split(',')
    var processStr =
        ` 
  - PROCESS-NAME,com.google.android.gms,全局选择
  - PROCESS-NAME,com.google.android.gsf,全局选择
  - PROCESS-NAME,com.android.vending,全局选择
`
    if (processes != null) {
        for (p in processes) {
            processStr += "  - PROCESS-NAME," + processes[p] + ",全局选择\n"
        }
    }

    var yamlText =
        `port: 7890
socks-port: 7891
mixed-port: 7893
allow-lan: false
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
proxies:
- name: "搬瓦工SS节点"
  type: ss                                  # 代理类型
  server: ${peer.server}                         # 服务器 IP
  port: ${peer.port}                                 #  端口号
  cipher: chacha20-ietf-poly1305   # 加密方法11111
  password: "${peer.passwrod}"                # SS 密码
  udp: true                                #默认不开启
proxy-groups:
  - name: 全局选择
    type: select
    proxies:
      - 搬瓦工SS节点
rules:${processStr}
  - MATCH,DIRECT
dns:
  enable: true
  enhanced-mode: fake-ip
  nameserver:
    - 114.114.114.114
    - 223.5.5.5
    - 8.8.8.8
  fallback: []
  fake-ip-filter: 
    - dns.msftncsi.com
    - www.msftncsi.com
    - www.msftconnecttest.com
tun:
  enable: true
  stack: gvisor 
  auto-detect-interface: true 
  auto-route: true 
  dns-hijack:
    - 198.18.0.2:53 
`
    fs.writeFile(file, yamlText, "utf8", (err) => {
        throw err
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 428,
        height: 926,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    console.log("getAppPath", app.getAppPath())
    app.setAppLogsPath(app.getAppPath())
    win.webContents.send('app-start', true)
    win.loadFile('index.html')
    // win.webContents.openDevTools()
}
app.whenReady().then(() => {
    ipcMain.on('start-vpn', handleStartVpn)
    ipcMain.on('stop-vpn', handleStopVpn)
    ipcMain.on('open-at-login', handleOpenAtLogin)
    createWindow()
    const { Menu } = require('electron');
    Menu.setApplicationMenu(null);
})
app.on('window-all-closed', () => {
    const devman = path.join(__dirname, './DevManView.exe');
    exec(devman, ['/uninstall', '"Clash Tunnel"'], function (err, stdout, stderr) { if (err) { throw err; return } console.log(stdout); });
    if (process.platform !== 'darwin') app.quit()
})