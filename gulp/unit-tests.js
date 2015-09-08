'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function(options) {
  function listFiles(callback) {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      exclude: [/bootstrap\.js/, /bootstrap\.css/],
      dependencies: true,
      devDependencies: true
    });

    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    var htmlFiles = [
      options.src + '/**/*.html'
    ];

    var srcFiles = [
      options.src + '/**/*.js'
    ]
        .concat(specFiles.map(function(file) {
      return '!' + file;
    }))
    ;


    gulp.src(srcFiles)
        .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'))
      .pipe(concat(function(files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles));
      }))

    ;

  }

  function runTests (singleRun, done) {
    listFiles(function(files) {
      console.log('testeing console');
      console.log(files);
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        //files: [ 'bower_components\\jquery\\dist\\jquery.js',
        //  'bower_components\\angular\\angular.js',
        //  'bower_components\\moment\\moment.js',
        //  'bower_components\\angular-bootstrap\\ui-bootstrap-tpls.js',
        //  'bower_components\\angular-mocks\\angular-mocks.js',
        //  'js/momentPicker.mdl.js',
        //  'js/momentInput.js',
        //  'js/momentPicker.js',
        //  'js/momentUtils.js',
        //  'js/**/*.html',
        //  'js/**/*.spec.js',
        //  'js/**/*.mock.js',
        //  'js/momentUtils.spec.js'],
        singleRun: singleRun
      }, done);
    });
  }

  gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
  });
  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
  });
};
