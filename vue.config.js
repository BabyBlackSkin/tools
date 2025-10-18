module.exports = {
    pluginOptions:{
        electronBuilder:{
            preload:'src/preload.js',
            // 如果package.json 中main指定background.js后仍然报错找不到，则开启这个
            // chainWebpackMainProcess: config => {
            //     config.output.filename('background.js')
            // },
            // 解决图标问题
            customFileProtocol: "./",
            // Invalid 'main' field in '...\package.json' of 'background.js'.
            // chainWebpackMainProcess: (config) => {
            //     config.output.filename('background.js');
            // },
            builderOptions: {
                nsis:{
                    oneClick: false, // 是否一键安装,
                    // perMachine:false,// 是否开启安装时权限限制（此电脑或当前用户）
                    // allowElevation:false,// 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowToChangeInstallationDirectory:true, // 允许修改安装目录
                },
                // 桌面应用程序
                productName: 'Tools',
                // 不将extraResources中的文件打包进去
                extraResources: [
                    // 设置打包的时候将数据库文件拷贝到根目录
                    { from: "./resource/tools.db", to: "../resources/" },
                ],
                // 配置打包后，在win下的应用图标。ico图片至少要是256*256尺寸的，尺寸太小，会打包失败
                // "mac": { "icon": "./public/favicon.icns" },
                // win: {
                //     icon: "./public/favicon_big.ico",
                //     // requestedExecutionLevel: "设置exe的运行权限"
                // }
                // 自动更新配置
                publish: {
                    provider: "github",
                    owner: "BabyBlackSkin",
                    repo: "tools"
                },
                // 生成更新文件
                generateUpdatesFilesForAllChannels: true,
                // 发布配置
                releaseInfo: {
                    releaseNotes: "新版本更新内容"
                }
            },
        }
    }
}
