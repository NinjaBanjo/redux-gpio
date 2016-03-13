var webpackConfigProd = require('./webpack.config.prod');
var webpackConfig = require('./webpack.config')();

module.exports = function(grunt) {

  grunt.initConfig({
    webpack: {
      main: webpackConfigProd
    }
  });

  grunt.registerTask('build', [
    'webpack'
  ]);

  grunt.registerTask('test', [
    'cleam:coverage',
    'karma:unit'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
};
