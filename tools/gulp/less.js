// Define Task for compressing CSS
var gulp       = require('gulp');
var config = require('../../gulp.config')();
var watch = require('gulp-watch');
var concat     = require('gulp-concat');
var less       = require('gulp-less');
var cssnano    = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require('gulp-plumber');
var autoprefixer   = require('gulp-autoprefixer');

gulp.task('less', function () {
    return gulp.src(config.styles)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + "styles/"))
        .pipe(config.browserSync.stream());
});

gulp.task('less:watch', ['less'], function () {
    watch(config.styles, function() {
        gulp.start('less');
    });
});

