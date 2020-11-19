module.exports = {
    devServer: {
        port: 3000,
        disableHostCheck: true,
        proxy: {
            '/apiserver': {
                target: 'http://14.49.45.139:7002/',
                changeOrigin: true,
                pathRewrite: {
                    '^/apiserver': '/api/demo'
                }
            }
        }
    }
}
