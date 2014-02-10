'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'test/test.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },
    // Unit tests.
    nodeunit: {
      tests: ['test/test.js'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);

};
