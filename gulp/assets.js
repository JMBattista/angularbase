var gulp = require('gulp');
var config = require('../gulp.config')();
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var plumber    = require('gulp-plumber');
// Define the task for copying html

gulp.task('assets', function () {
    processFavicon();
    processAssets();
    return processFonts();
});

gulp.task('assets:watch', ['assets'], function () {
    watch(config.icon, function() {
        processFavicon();
    });
    watch(config.assets, function() {
        processAssets();
    });
    watch(config.fonts, function() {
        processFonts();
    });
});

function processFavicon() {
    return gulp.src(config.icon)
        .pipe(plumber())
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest))
        .pipe(config.browserSync.stream());
};

function processFonts() {
    return gulp.src(config.fonts)
        .pipe(plumber())
        .pipe(changed(config.dest + "fonts/"))
        .pipe(gulp.dest(config.dest + "fonts/"))
        .pipe(config.browserSync.stream());
}

function processAssets() {
    return gulp.src(config.assets)
        .pipe(plumber())
        .pipe(changed(config.dest + "assets/"))
        .pipe(gulp.dest(config.dest + "assets/"))
        .pipe(config.browserSync.stream());
}
