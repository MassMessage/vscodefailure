const path = require('path');

module.exports = {
  entry: './public/electron.js',
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    alias: {
      '@Shared': path.resolve(__dirname, 'src/shared')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};