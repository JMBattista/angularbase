// Define Task for compressing CSS
var gulp       = require('gulp');
var config = require('../gulp.config')();
var changed = require('gulp-changed');
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');

gulp.task('fonts', function () {
    return gulp.src(config.fonts)
        .pipe(plumber())
        .pipe(changed(config.dest + "fonts/"))
        .pipe(gulp.dest(config.dest + "fonts/"))
        .pipe(livereload());
});

gulp.task('fonts:watch', ['fonts'], function () {
    livereload.listen();
    gulp.watch(config.fonts, ['fonts']);
});

