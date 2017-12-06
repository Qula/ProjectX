module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

   jshint: {
      src: "*.js"
   },

   watch:{
     files: "scripts/*.js",
     tasks: ['jshint'],
   },

   uglify: {
      build: {
        src: 'scripts/script.js',
        dest: 'build/script.min.js'
      }
    },

    cssmin: {
      build: {
        src: 'stylesheet.css',
        dest: 'build/stylesheet.min.css'
      }
    },

    concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['script.js','test2.js'],
      dest: 'dist/built.js',
    },
  },


  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Default task(s).
  grunt.registerTask('default', ['jshint']);


};