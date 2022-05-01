import { app, ipcMain, dialog } from "electron"

export function initIpcMain(win, store) {
    ipcMain.on("close", e => {
        if (process.platform === "darwin") {
            win.hide()
        }
        e.preventDefault() //阻止默认行为
        dialog
            .showMessageBox({
                type: "info",
                title: "Information",
                cancelId: 2,
                defaultId: 0,
                message: "确定要关闭吗？",
                buttons: ["最小化", "直接退出"],
            })
            .then(result => {
                if (result.response === 0) {
                    e.preventDefault() //阻止默认行为
                    win.minimize() //调用 最小化实例方法
                } else if (result.response === 1) {
                    win = null
                    //app.quit();
                    app.exit() //exit()直接关闭客户端，不会执行quit();
                }
            })
            .catch(err => {
                console.log(err)
            })
    })

    ipcMain.on("minimize", () => {
        win.minimize()
    })

    ipcMain.on("settings", (event, options) => {
        store.set("settings", options)
    })
}
