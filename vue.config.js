module.exports = {
    configureWebpack: {
      module: {
          rules: [{
              test: /\.gpx$/i,
              use: [{
                  loader: 'url-loader'
              }]
          }]
      }
    }
  }