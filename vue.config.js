module.exports = {
    transpileDependencies: ['vuetify'],
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: './public/service-worker-dev.js',
            // ...other Workbox options...
        },
    },
};
