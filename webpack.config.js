var webpack = require('webpack');

module.exports = function() {return {
  target: 'node',
  entry: {
    main: './lib/boot'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  plugins: [

  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  }
}}
