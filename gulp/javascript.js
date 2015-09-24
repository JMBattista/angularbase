var gulp       = require('gulp');
var config = require('../gulp.config')();
var watch = require('gulp-watch');
var concat     = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber    = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var livereload = require('gulp-livereload');
var jshint     = require('gulp-jshint');
var using      = require('gulp-using');

// lints all JS files in dev/js
gulp.task('lint', function(){
	return gulp.src(config.source)
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'));
});

gulp.task('js', function () {
    return gulp.src(config.source)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(livereload());
});

gulp.task('js-dev', function () {
    return gulp.src(config.source)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(livereload());
});

gulp.task('js:watch', ['js-dev'], function () {
    livereload.listen();
    watch(config.source, function() {
        gulp.start('js-dev');
    });
});
