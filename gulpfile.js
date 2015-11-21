'use strict';

var gulp = require('gulp');
var foso = require('foso');
var test = require('fosify-test');

gulp.task('test', function() {
  foso
    .please({
      watch: true
    })
    .fosify(test)
    .now();
});
