const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  assetsDir: 'assets',
  devServer: {
    proxy: 'http://angar.loc',
  },
})
