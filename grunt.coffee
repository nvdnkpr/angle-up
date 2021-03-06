module.exports = (grunt)->
  console.log "GRUNT..."

  grunt.initConfig
    coffee:
      app:
        files:
          'test/unit/*.js': 'test/src/*.coffee'
          'app/js/*.js': 'app/src/*.coffee'


    watch:
      files: ["test/src/*.coffee", "app/src/*.coffee"]
      tasks: "coffee"
       

  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask "default", "coffee"
