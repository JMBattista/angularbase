var gulp = require('gulp');
var config = require('../gulp.config')();
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
// Define the task for copying html

gulp.task('assets', function () {
    processFavicon();
    processAssets();

});

gulp.task('assets:watch', ['assets'], function () {
    livereload.listen();
    watch(config.icon, function() {
        processFavicon();
    });
    watch(config.assets, function() {
        processAssets();
    });
});

function processFavicon() {
    return gulp.src(config.icon)
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
};

function processAssets() {
    return gulp.src(config.assets)
        .pipe(changed(config.dest + "assets/"))
        .pipe(gulp.dest(config.dest + "assets/"))
        .pipe(livereload());
}
