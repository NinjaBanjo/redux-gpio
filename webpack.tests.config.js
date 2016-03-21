var webpack = require('webpack');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');

webpackConfig.devtool = 'source-map';
webpackConfig.entry = {tests:'./test-main.js'};

module.exports = webpackConfig;
