var webpackConfigProd = require('./webpack.config.prod');
var webpackConfig = require('./webpack.config')();

module.exports = function(grunt) {

  grunt.initConfig({
    mochaTest: {
      all: {
        src: ['tests/unit/**/*-test.js'],
        options: {
          reporter: 'dot',
          require: [
            'babel-register',
            'coverage/blanket'
          ]
        },
        coverage: {
          options: {
            reporter: 'html-cov',
            quiet: true,
            captureFile: 'coverage/coverage.html'
          },
          src: ['tests/**/*.js']
        }
      },
      most: {
        src: ['tests/**/!(*-s-test)-test.js'],
        reporter: 'dot'
      }
    },
    webpack: {
      main: webpackConfigProd
    }
  });

  grunt.registerTask('build', [
    'webpack'
  ]);

  grunt.registerTask('test', [
    'mochaTest:all'
  ]);

  grunt.registerTask('testmost', [
    'mochaTest:most'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-mocha-test');
};
