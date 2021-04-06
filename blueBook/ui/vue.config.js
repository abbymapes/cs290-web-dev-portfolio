module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '^/bluebook': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
};
