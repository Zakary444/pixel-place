const { defineConfig } = require('@vue/cli-service')

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  }
}
