var gulp = require('gulp');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('compass', function() {
  gulp.src('src/scss/**/*.scss')
      .pipe(compass({
        css: 'dest/css',
        sass:'src/scss',
        style: 'compressed'
      }))
      .pipe(gulp.dest('dest/css'));
});

gulp.task('concat', function() {
  gulp.src(['src/js/Cisolasse.js', 'src/js/Partial.js', 'src/js/Wireframe.js'])
      .pipe(gulp.dest('dest/js'))
      .pipe(concat('HTML5-Wireframe.min.js'))
      .pipe(gulp.dest('dest/js'));
});

gulp.task('default', ['compass', 'concat']);
