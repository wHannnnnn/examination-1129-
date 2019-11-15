const webpack = require('webpack')
module.exports = {
    // 这里是配置上线读取当前目录，默认是根路径，如 /js, /css 等，具体根据项目来
    publicPath: './',
    productionSourceMap: false,
    // others
    lintOnSave: false,
    chainWebpack:(config)=>{
      config.plugins.delete('fork-ts-checker') // 禁用fork-ts-checker
    },
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "windows.jQuery": "jquery"
        })

      ]

    }
  }