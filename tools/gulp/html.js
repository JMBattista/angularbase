var gulp = require('gulp'),
    config = require('../gulp.config')(),
     watch = require('gulp-watch'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber    = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    using = require('gulp-using'),
    filter = require('gulp-filter'),
    cssnano  = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('html', function() {
    processIndex();
    processPartials();
});

gulp.task('html:watch', ['html'], function () {
    watch(config.html, function() {
        processPartials();
    });
    watch([config.index, config.bower.source, config.bower.style], function() {
        processIndex();
    });
});

function processIndex() {
    var assets = useref.assets({searchPath: './'});

    return gulp.src(config.index)
        .pipe(plumber())
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.dest))
        .pipe(config.browserSync.stream());
}

function processPartials() {
    return gulp.src(config.html)
        .pipe(getHtmlMinify())
        .pipe(templateCache(config.templateCache.file, config.templateCache.options))
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(config.browserSync.stream());
}

function getHtmlMinify() {
    return htmlmin({collapseWhitespace: true});
}
