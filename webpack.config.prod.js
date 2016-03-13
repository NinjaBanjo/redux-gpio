var webpack = require('webpack');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');

webpackConfig.devtool = 'source-map';
webpack.plugins = webpackConfig.plugins.concat([
  new webpack.optimize.DedupePlugin(),
  new webpack.BannerPlugin(`BuildVersion: ${pkg.version}\nBuildTime: ${new Date().toString()}`)
])

module.exports = webpackConfig;
