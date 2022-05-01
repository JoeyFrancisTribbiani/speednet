const { app, Menu } = require('electron')
// import { autoUpdater } from "electron-updater"
// const version = app.getVersion();

export function createMenu(win) {
    console.log('createMenu')

    let menu = null
    const template = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Search',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        win.webContents.send('search')
                    },
                },
            ],
        },
        {
            label: 'Controls',
            submenu: [
                {
                    label: 'Play',
                    click: () => {
                        win.webContents.send('play')
                    },
                },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'close' },
                { role: 'minimize' },
                { role: 'zoom' },
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Electron',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    },
                },
                {
                    label: '开发者工具',
                    accelerator: 'F12',
                    click: () => {
                        win.webContents.openDevTools()
                    },
                },
            ],
        },
    ]
    // for window
    // if (process.platform === "win32") {
    //   template.push({
    //     label: "Help",
    //     submenu: [
    //       {
    //         label: `Current version v${version}`,
    //         enabled: false,
    //       },
    //       {
    //         label: "Check for update",
    //         accelerator: "Ctrl+U",
    //         click: (item, focusedWindow) => {
    //           win = focusedWindow;
    //           updateSource = "menu";
    //           autoUpdater.checkForUpdates();
    //         },
    //       },
    //     ],
    //   });
    // }
    // console.log(template)
    menu = Menu.buildFromTemplate(template)

    console.log(menu)
    Menu.setApplicationMenu(menu)
}
