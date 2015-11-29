'use strict';

var gulp = require('gulp');
var Foso = require('foso');
var test = require('fosify-test');

gulp.task('test', function() {
  var foso = new Foso();
  foso
    .register(test, {
      watch: true
    })
    .then(() => foso.bundle());
});
