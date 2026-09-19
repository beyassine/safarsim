const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      // The bundled calc parser cannot parse Vuetify's modern calc-size().
      // Preserve these expressions for the browser; keep other CSS minification.
      config.optimization.minimizer('css').tap((args) => {
        args[0].minimizerOptions.preset[1].calc = false
        return args
      })
    }
  },
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          return !error?.message?.includes('ResizeObserver loop completed')
        },
      },
    },
  },
})
