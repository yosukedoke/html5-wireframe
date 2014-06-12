module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        'globals': {
          'jQuery': true
        }
      },
      all: ['js/**/*.js']
    },
    csslint: {
      fuzzy: {
        options: {
          'box-model': false,
          'duplicate-properties': false,
          'non-link-hover': false,
          'adjoining-classes': false,
          'box-sizing': false,
          'text-indent': false,
          'fallback-colors': false,
          'unique-headings': false,
          'qualified-headings': false,
          'overqualified-elements': false,
          'display-property-grouping': false,
          'font-sizes':false
        },
        src: ['tmp-css/**/*.css']
      }
    },
    compass: {
      all: {
        options: {
          config: 'config.rb'
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'tmp-css/',
        src: ['**/*.css', '**/!*.min.css'],
        dest: '../dist/css/'
      }
    },
    uglify: {
      options: {
      },
      all: {
        files: [{
          expand: true,
          cwd: 'js',
          src: '**/*.js',
          dest: '../dist/js'
        }]
      }
    },

    // 必要に応じてconcat結合し、不要な元ファイルがあれば適宜cleanで消す
    concat: {
      options: {

      },
      nothing: {}
    },
    clean: {
      options: {

      },
      nothing: {}
    },

    // watch or esteWatch好きな方を使ってください
    watch: {
      stylesheets: {
        files: 'scss/**/*.scss',
        tasks:['default']
      },
      scripts: {
        files: 'js/**/*.js',
        tasks:['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'compass', 'csslint', 'cssmin', 'uglify', 'concat', 'clean']);
};