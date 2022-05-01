"use strict"
import { app, BrowserWindow, protocol, shell } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"

import { initIpcMain } from "./electron/ipcMain.js"
import { createMenu } from "./electron/menu"
import { createTray } from "@/electron/tray"
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import express from "express"
import log from "electron-log"
import { SYS_CONFIG } from "@/config"
import Store from "electron-store"

//本地日志
log.transports.console.level = "silly"
log.transports.file.level = "silly"

log.transports.file.fileName = "main.log"
log.transports.file.file = "D:\\electron\\main.log"

class Background {
    constructor() {
        this.window = null
        this.tray = null
        this.store = new Store({
            windowWidth: {
                width: { type: "number", default: 1440 },
                height: { type: "number", default: 840 },
            },
        })
        this.expressApp = null
        this.willQuitApp = process.platform === "darwin" ? false : true

        this.init()
    }

    init() {
        console.log("initializing")

        // Make sure the app is singleton.
        if (!app.requestSingleInstanceLock()) return app.quit()

        // create Express app
        this.createExpressApp()

        // init ipcMain
        initIpcMain(this.window, this.store)

        // Scheme must be registered before the app is ready
        protocol.registerSchemesAsPrivileged([
            { scheme: "app", privileges: { secure: true, standard: true } },
        ])

        // handle app events
        this.handleAppEvents()
    }

    async initDevtools() {
        // Install Vue Devtools extension
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString())
        }

        // Exit cleanly on request from parent process in development mode.
        if (process.platform === "win32") {
            process.on("message", data => {
                if (data === "graceful-exit") {
                    app.quit()
                }
            })
        } else {
            process.on("SIGTERM", () => {
                app.quit()
            })
        }
    }

    createExpressApp() {
        console.log("creating express app")

        const expressApp = express()
        console.log("__dirname=" + __dirname)
        expressApp.use("/", express.static(__dirname + "/"))
        expressApp.use("/app", express.static("./dist/"))
        this.expressApp = expressApp.listen(SYS_CONFIG.SERVER_PORT)
    }

    createWindow() {
        console.log("creating app window")

        this.window = new BrowserWindow({
            width: this.store.get("window.width") | 1440,
            height: this.store.get("window.height") | 840,
            minWidth: 1080,
            minHeight: 720,
            // titleBarStyle: "hiddenInset",
            // frame: process.platform !== 'win32',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
            },
        })

        // hide menu bar on Microsoft Windows and Linux
        this.window.setMenuBarVisibility(true)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
            if (!process.env.IS_TEST) this.window.webContents.openDevTools()
        } else {
            log.info("load http://localhost:" + SYS_CONFIG.SERVER_PORT)
            createProtocol("app")
            this.window.loadURL("http://localhost:" + SYS_CONFIG.SERVER_PORT)
        }
    }

    handleWindowEvents() {
        this.window.once("ready-to-show", () => {
            console.log("windows ready-to-show event")
            this.window.show()
        })

        this.window.on("close", e => {
            console.log("windows close event")
            if (this.willQuitApp) {
                /* the user tried to quit the app */
                this.window = null
                app.quit()
            } else {
                /* the user only tried to close the window */
                e.preventDefault()
                this.window.hide()
            }
        })

        this.window.on("resize", () => {
            let { height, width } = this.window.getBounds()
            this.store.set("window", { height, width })
        })

        this.window.on("minimize", () => {
            if (
                ["win32", "linux"].includes(process.platform) &&
                this.store.get("settings.minimizeToTray")
            ) {
                this.window.hide()
            }
        })

        this.window.webContents.on("new-window", function (e, url) {
            e.preventDefault()
            shell.openExternal(url)
        })
    }

    handleAppEvents() {
        app.on("ready", async () => {
            // This method will be called when Electron has finished
            // initialization and is ready to create browser windows.
            // Some APIs can only be used after this event occurs.
            console.log("app ready event")

            // for development
            if (process.env.NODE_ENV !== "production") {
                this.initDevtools()
            }

            // create window
            this.createWindow()
            this.handleWindowEvents()

            // create menu
            createMenu(this.window)

            // create tray
            if (["win32", "linux"].includes(process.platform)) {
                this.tray = createTray(this.window)
            }
        })

        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            console.log("app activate event")
            if (this.window === null) {
                this.createWindow()
            } else {
                this.window.show()
            }
        })

        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit()
            }
        })

        app.on("before-quit", () => {
            this.willQuitApp = true
        })

        app.on("quit", () => {})
    }
}

new Background()
