var webpackConfig = rquire('./webpack.config.js')();

module.exports = function(grunt) {

  grunt.initConfig({
    webpack: webpackConfig
  });

  grunt.registerTask('build', [
    'clean:dist',
    'test',
    'webpack'
  ]);

  grunt.registerTask('test', [
    'cleam:coverage',
    'karma:unit'
  ]);

  grunt.registerTask()

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
};
