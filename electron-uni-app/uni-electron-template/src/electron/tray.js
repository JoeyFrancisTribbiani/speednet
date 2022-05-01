/* global __static */
import path from "path"
import { app, nativeImage, Tray, Menu } from "electron"

export function createTray(win) {
    let icon = nativeImage.createFromPath(path.join(__static, "img/icons/logo.png")).resize({
        height: 20,
        width: 20,
    })
    let tray = new Tray(icon)

    tray.setToolTip("uni-electron")

    tray.on("click", () => {
        win.show()
    })

    tray.on("right-click", () => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "设置",
                icon: nativeImage.createFromPath(path.join(__static, "img/icons/exit.png")),
                accelerator: "CmdOrCtrl+P",
                click: () => {
                    win.webContents.send("changeRouteTo", "/settings")
                },
            },
            {
                label: "退出",
                icon: nativeImage.createFromPath(path.join(__static, "img/icons/exit.png")),
                accelerator: "CmdOrCtrl+W",
                click: () => {
                    app.exit()
                },
            },
        ])

        tray.popUpContextMenu(contextMenu)
    })

    return tray
}
