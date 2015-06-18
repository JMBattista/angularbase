var gulp = require('gulp');
var config = require('../gulp.config')();
var useref = require('gulp-useref');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var plumber    = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var using = require('gulp-using');
var filter = require('gulp-filter');
var minifyCss  = require('gulp-minify-css');

// Define the task for copying html
gulp.task('html:index', function () {
    var assets = useref.assets({searchPath: './'});
    var jsFilter = filter("**/*.js");
    var cssFilter = filter("**/*.css");
  
  
    return gulp.src(config.index)
        .pipe(plumber())
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        // .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('html:partials', function () {
    return gulp.src(config.html)
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('html', ['html:index', 'html:partials']);

gulp.task('html:watch', ['html'], function () {
    livereload.listen();
    gulp.watch(config.html, ['html:partials']);
    gulp.watch([config.index, config.bower.source, config.bower.style], ['html:index']);
});

