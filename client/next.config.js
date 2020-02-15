const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

module.exports = withImages(
    withCSS({
        useFileSystemPubilcRoutes: false,
        publicRuntimeConfig: {
            version: {
                name: 'Block explorer'
            },
            PORT: parseInt(process.env.PORT, 10) || 3000,
            API_URL: process.env.API_URL || 'http://localhost:9086'
        },
        webpack: (config, { buildId, dev, isServer }) => {
            // This allows the app to refer to files through our symlink
            config.resolve.symlinks = false
            if (!isServer) {
                config.node = {
                    fs: 'empty'
                }
            }
            return config
        }
    })
)
