var webpackConfigProd = require('./webpack.config.prod');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');
var execSync = require('child_process').execSync;

var testCmd = "./node_modules/.bin/babel-node " +
"node_modules/isparta/bin/isparta cover --report text --report html " +
"node_modules/mocha/bin/_mocha -- --reporter dot ";

module.exports = function(grunt) {
  grunt.initConfig({
    compress: {
      dist: {
        options: {
          archive: 'dist/' + pkg.name + '_' + pkg.version + '.zip',
          mode: 'zip',
          pretty: true
        },
        // this has to be an object with src property in an array for it to use bob properly
        files: [{src:'dist/**/*.js'}]
      }
    },
    webpack: {
      main: webpackConfigProd
    }
  });

  grunt.registerTask('build', [
    'test',
    'webpack'
  ]);

  grunt.registerTask('pack', [
    'build',
    'compress:dist'
  ]);

  grunt.registerTask('test', function() {
    // Come long callout using babel-node to compile with .babelrc settings and isparta to report coverage.
    // reporters are setup using --reporter per isparta documentation
    // Mocha config is also tagged onto the end
    execSync(testCmd + "'tests/**/*-test.js'", {
      stdio:[0,1,2] // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('testmost', function() {
    // Come long callout using babel-node to compile with .babelrc settings and isparta to report coverage.
    // reporters are setup using --reporter per isparta documentation
    // Mocha config is also tagged onto the end
    execSync(testCmd + "'tests/**/!(*-s-test)-test.js'", {
      stdio:[0,1,2] // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
};
