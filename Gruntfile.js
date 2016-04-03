var webpackConfigProd = require('./webpack.prod.config');
var webpackConfigTests = require('./webpack.tests.config');
var webpackConfig = require('./webpack.config')();
var pkg = require('./package.json');
var execSync = require('child_process').execSync;

// NOTE: _mocha vs mocha as _mocha tests sync and allows coverage reporting
var coverCmd = "./node_modules/.bin/istanbul cover ";
var testCmd =  "./node_modules/.bin/_mocha"; // run tets through istanbul in node
var mochaArgs = " --reporter dot ";

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    copy: {
      pkg: {
        files: [
          {src: ['package.json'], dest: 'dist/package.json'}
        ]
      }
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/' + pkg.name + '_' + pkg.version + '.zip',
          mode: 'zip',
          pretty: true
        },
        // this has to be an object with src property in an array for it to glob properly
        files: [
          {expand: true, cwd: 'dist', src:['**']}
        ]
      }
    },
    clean: {
      coverage: './coverage',
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
    execSync(testCmd + mochaArgs + "dist/tests.js", {
      stdio: 'inherit' // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('run-integration-tests', function() {
    execSync(testCmd + mochaArgs + "dist/tests-i.js", {
      stdio: 'inherit' // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('run-cover', function() {
    execSync(coverCmd + testCmd + ' --' + mochaArgs + "dist/tests.js", {
      stdio: 'inherit' // <-- this writes the exec to the console with colors
    });
  });

  grunt.registerTask('package-modules', function() {
    execSync('npm install --production --ignore-scripts --prefix dist/', {
      stdio: 'inherit'
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
    'copy:pkg',
    'package-modules',
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

  grunt.registerTask('test-all', [
    'test',
    'run-integration-tests'
  ]);

  grunt.registerTask('cover', [
    'clean:coverage',
    'build-tests',
    'run-cover'
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
};
