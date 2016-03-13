var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'source-map';
webpack.plugins = webpackConfig.plugins.concat([
  new webpack.DedupePlugin(),
  new webpack.BannerPlugin(`BuildVersion: ${pkg.version}\nBuildTime: ${new Date().toString()}`)
])

module.exports = webpackConfig;
