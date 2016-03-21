var nodeExternals = require('webpack-node-externals');

module.exports = function() {return {
  target: 'node',
  entry: {
    tracker: './lib/boot'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  plugins: [],
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  }
};};
