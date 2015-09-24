var gulp = require('gulp');
var config = require('../gulp.config')();
var livereload = require('gulp-livereload');
// Define the task for copying html
gulp.task('favicon', function () {
    return gulp.src(config.icon)
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('assets', ['favicon'], function () {
    return gulp.src(config.assets)
        .pipe(gulp.dest(config.dest + "assets/"))
        .pipe(livereload());
});

gulp.task('assets:watch', ['assets'], function () {
    livereload.listen();
    gulp.watch(config.assets, ['assets']);
});

