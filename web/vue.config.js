
module.exports = {
    outputDir: '../dist',
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8083,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        open: false,
        proxy: {
            '/api': {
                logLevel: 'debug',
                target: 'http://127.0.0.1:3000/', // ''中可代理任意服务，包括本地服务
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}
