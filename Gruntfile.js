var webpackConfigProd = require('./webpack.prod.config');
var webpackConfigTests = require('./webpack.tests.config');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');
var execSync = require('child_process').execSync;

var testCmd = "./node_modules/.bin/istanbul cover --report html ./node_modules/.bin/mocha -- --require source-map-support/register "; // run tets through istanbul in node

module.exports = function(grunt) {
  grunt.initConfig({
    compress: {
      dist: {
        options: {
          archive: 'dist/' + pkg.name + '_' + pkg.version + '.zip',
          mode: 'zip',
          pretty: true
        },
        // this has to be an object with src property in an array for it to glob properly
        files: [{src:'dist/**/*.js'}]
      }
    },
    clean: {
      test: './dist/tests.js',
      dist: './dist'
    },
    webpack: {
      main: webpackConfigProd,
      tests: webpackConfigTests
    }
  });

  grunt.registerTask('run-tests', function() {
    execSync(testCmd + "dist/tests.js", {
      stdio: 'inherit' // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('type-check', function() {
    execSync('npm run flow', { stdio: 'inherit' });
  });

  grunt.registerTask('build', [
    'clean:dist',
    'test',
    'webpack:main'
  ]);

  grunt.registerTask('pack', [
    'build',
    'compress:dist'
  ]);

  grunt.registerTask('build-tests', [
    'clean:test',
    'webpack:tests'
  ]);

  grunt.registerTask('test', [
    'build-tests',
    'run-tests'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
};
