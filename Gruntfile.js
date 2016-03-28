var webpackConfigProd = require('./webpack.prod.config');
var webpackConfigTests = require('./webpack.tests.config');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');
var execSync = require('child_process').execSync;

// NOTE: _mocha vs mocha as _mocha tests sync and allows coverage reporting
var testCmd = "./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha --  --reporter dot "; // run tets through istanbul in node

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
    eslint: {
      all: ['lib/**/*.js']
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
    'lint-all',
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

  grunt.registerTask('lint-all', [
    'eslint:all'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
};
