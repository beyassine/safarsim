const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
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
