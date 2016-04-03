var webpack = require('webpack');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');

webpackConfig.entry = {
  tests:'./test-main.js',
  'tests-i':'./test-i-main.js'
};

module.exports = webpackConfig;
