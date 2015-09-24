var gulp = require('gulp');
var config = require('../gulp.config')();
var watch = require('gulp-watch');
var useref = require('gulp-useref');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var plumber    = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var using = require('gulp-using');
var filter = require('gulp-filter');
var minifyCss  = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');

// Define the task for copying html
gulp.task('html:index', function () {
    var assets = useref.assets({searchPath: './'});
    var jsFilter = filter("lib.js");
    var cssFilter = filter("lib.css");


    return gulp.src(config.index)
        .pipe(plumber())
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('html:partials', function () {
    return gulp.src(config.html)
        .pipe(templateCache(config.templateCache.file, config.templateCache.options))
        // .pipe(minifyHTML({empty:true}))
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(livereload());
});

gulp.task('html', ['html:index', 'html:partials']);

gulp.task('html:watch', ['html'], function () {
    livereload.listen();
    watch(config.html, function() {
        gulp.start('html:partials');
    });
    watch([config.index, config.bower.source, config.bower.style], function() {
        gulp.start('html:index')
    });
});

