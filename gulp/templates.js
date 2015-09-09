'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');


module.exports = function(options) {
  gulp.task('templates', function () {
    return gulp.src(options.src + '/**/*.html')
      .pipe(templateCache('templates.js', {module: 'momentPicker'}))
      .pipe(gulp.dest(options.src));
  });
};

