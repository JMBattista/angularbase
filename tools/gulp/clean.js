var gulp  = require('gulp');
var config = require('../../gulp.config')();
var rimraf = require('rimraf');

gulp.task('clean', function (cb) {
    rimraf(config.dest, cb);
});