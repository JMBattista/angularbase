// Define Task for compressing CSS
var gulp       = require('gulp');
var config = require('../gulp.config')();
var concat     = require('gulp-concat');
var less       = require('gulp-less');
var minifyCss  = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require('gulp-plumber');
var autoprefixer   = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');

gulp.task('less', function () {
    return gulp.src(config.styles)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + "styles/"))
        .pipe(livereload());
});

gulp.task('less:watch', ['css'], function () {
    livereload.listen();
    gulp.watch(config.styles, ['css']);
});

