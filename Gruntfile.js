module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        cwd: "",
        src: ["**/*.coffee", "!node_modules/**/*.coffee"],
        dest: '',
        ext: ".js"
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  return grunt.registerTask('default', ['coffee', 'watch']);
};

//# sourceMappingURL=Gruntfile.js.map
