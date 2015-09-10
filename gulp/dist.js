'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var concat = require('gulp-concat');
var less = require('gulp-less');
var _ = require('lodash');


module.exports = function(options) {

  gulp.task('dist-styles', [], function(){
    return gulp.src('styles/angular-moment-picker.less')
        .pipe(less({}))
        .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('dist', ['templates', 'dist-styles'], function () {

    return gulp.src([options.src + '/**/*.js', '!' + options.src + '/**/*.spec.js'])
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'))
      .pipe(concat('angular-moment-picker.js'))
      .pipe($.size())
      .pipe(gulp.dest(options.dist));
  });
};
