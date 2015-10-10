var gulp = require('gulp'),
    config = require('../gulp.config')(),
     watch = require('gulp-watch'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber    = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    using = require('gulp-using'),
    filter = require('gulp-filter'),
    minifyCss  = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache');

// Define the task for copying html
gulp.task('html:index', function () {
    var assets = useref.assets({searchPath: './'});

    return gulp.src(config.index)
        .pipe(plumber())
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('html:partials', function () {
    return gulp.src(config.html)
        .pipe(getHtmlMinify())
        .pipe(templateCache(config.templateCache.file, config.templateCache.options))
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(livereload());
});

function getHtmlMinify() {
    return minifyHTML({
                empty:true,
                spare:true,
                quotes:true,
                });
}

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

