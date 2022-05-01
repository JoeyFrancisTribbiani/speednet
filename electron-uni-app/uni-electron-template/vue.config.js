const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

function resolve(dir) {
    return path.join(__dirname, dir)
}

console.log(__dirname)
console.log(path.join(__dirname, "/dist/dev/h5/static"))

module.exports = {
    devServer: {
        disableHostCheck: true,
        port: process.env.DEV_SERVER_PORT || 8080,
        proxy: {
            "^/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/",
                },
            },
        },
    },
    pwa: {
        name: "uni-electron-template",
        iconPaths: {
            favicon32: "img/icons/logo.png",
        },
        themeColor: "#ffffff00",
        manifestOptions: {
            background_color: "#335eea",
        },
        // workboxOptions: {
        //   swSrc: "dev/sw.js",
        // },
    },
    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "uni-electron-template",
            chunks: ["main", "chunk-vendors", "chunk-common", "index"],
        },
    },
    chainWebpack(config) {

        config.resolve.alias.set("~@", resolve("src"))
        config.module.rules.delete("svg")
        config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end()
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/assets/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end()

    },
    configureWebpack: {
        resolve: {
            extensions: [".js", ".vue"],
            alias: {
                "~@": resolve("src")
            },
        },
        plugins: [
            //复制静态文件，以解决动态引入的资源文件会被打包的问题，如:src='icon'
            //两个目录的名称是其它地方配置的
            new CopyWebpackPlugin(
                [
                    {
                        //dist\dev\h5\static
                        from: resolve("/dist/dev/h5/static"),
                        //dist_electron\bundled\static
                        to: resolve("/dist_electron/bundled/static"),
                    },
                ],
                {
                    //导入的字体文件会在static\fonts文件夹，无需再复制
                    ignore: ["*.ttf"],
                },
            ),
        ],
    },
    // 添加插件的配置
    pluginOptions: {

        // electron-builder的配置文件
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "uni-electron-template",
                copyright: "Copyright © 2317809130@qq.com",
                // compression: "maximum", // 机器好的可以打开，配置压缩，开启后会让 .AppImage 格式的客户端启动缓慢
                //TODO asar：调试的时候不开启，可以查看vue打包生成的文件，生产环境改成true
                asar: false,
                directories: {
                    output: "dist_electron",
                },
                mac: {
                    target: [
                        {
                            target: "dmg",
                            arch: ["x64", "arm64", "universal"],
                        },
                    ],
                    artifactName: "${productName}-${os}-${version}-${arch}.${ext}",
                    category: "public.app-category.uni-electron-template",
                    darkModeSupport: true,
                },
                win: {
                    target: [
                        {
                            target: "portable",
                            arch: ["x64"],
                        },
                        {
                            target: "nsis",
                            arch: ["x64"],
                        },
                    ],
                    publisherName: "uni-electron-template",
                    icon: "build/icons/icon.ico",
                },
                linux: {
                    target: [
                        {
                            target: "AppImage",
                            arch: ["x64"],
                        },
                        {
                            target: "tar.gz",
                            arch: ["x64"],
                        },
                        {
                            target: "deb",
                            arch: ["x64"],
                        },
                        {
                            target: "rpm",
                            arch: ["x64"],
                        },
                        {
                            target: "snap",
                            arch: ["x64"],
                        },
                        {
                            target: "pacman",
                            arch: ["x64"],
                        },
                    ],
                    category: "Work",
                    icon: "./build/icon.icns",
                },
                dmg: {
                    icon: "build/icons/icon.icns",
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                    perMachine: true,
                },
            },
            // 主线程的配置文件
            chainWebpackMainProcess: (config) => {
                config.plugin("define").tap((args) => {
                    args[0]["IS_ELECTRON"] = true
                    return args
                })
            },
            // 渲染线程的配置文件
            chainWebpackRendererProcess: (config) => {
                // 渲染线程的一些其他配置
                // Chain webpack config for electron renderer process only
                // The following example will set IS_ELECTRON to true in your app
                config.plugin("define").tap((args) => {
                    args[0]["IS_ELECTRON"] = true
                    return args
                })
            },
            // 主入口文件
            // mainProcessFile: 'src/main.js',
            // mainProcessArgs: []
        },
    },
}
