'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var concat = require('gulp-concat');
var _ = require('lodash');


module.exports = function(options) {

  gulp.task('dist', ['templates'], function () {

    return gulp.src([options.src + '/**/*.js', '!' + options.src + '/**/*.spec.js'])
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'))
      //.pipe($.jshint())
      //.pipe($.jshint.reporter('jshint-stylish'))
      .pipe(concat('angular-moment-picker.js'))
      .pipe($.size())
      .pipe(gulp.dest(options.dist));
  });
};
