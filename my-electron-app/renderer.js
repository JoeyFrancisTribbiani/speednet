console.log("rednerer.js loaded!")
window.electronAPI.appStart((event, value) => {
    console.log("rednerer.appstart gat!", value)
    window.localStorage.setItem("appStart", true)
})
