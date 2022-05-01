export function ipcRenderer(vueInstance) {
    const self = vueInstance
    // 添加专有的类名
    document.body.setAttribute("data-electron", "yes")
    document.body.setAttribute("data-electron-os", window.require("os").platform())
    // ipc message channel
    const electron = window.require("electron")
    const ipcRenderer = electron.ipcRenderer

    // listens to the main process 'changeRouteTo' event and changes the route from
    // inside this Vue instance, according to what path the main process requires.
    // responds to Menu click() events at the main process and changes the route accordingly.

    ipcRenderer.on("changeRouteTo", (event, path) => {})

    ipcRenderer.on("search", () => {
        // 触发数据响应
    })

    ipcRenderer.on("routerGo", (event, where) => {
        console.log(where)
    })
}
