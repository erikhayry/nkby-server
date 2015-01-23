module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      server: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      server: {
        script: 'server.js'
      }
    },
    watch: {
      coffee: {
        files: ['**/*.coffee'],
        tasks: ['coffee'],
        options: {
          spawn: false
        }
      }
    },
    coffee: {
      options: {
        bare: true,
        sourceMap: true
      },
      compile: {
        expand: true,
        flatten: false,
        cwd: '',
        src: ['**/*.coffee', '!node_modules/**/*.coffee'],
        dest: '',
        ext: '.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  return grunt.registerTask('default', ['coffee', 'concurrent']);
};

//# sourceMappingURL=Gruntfile.js.map
