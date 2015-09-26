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
var tslint     = require('gulp-tslint');
var using      = require('gulp-using');
var tsc        = require('gulp-typescript');
var babel      = require('gulp-babel');
var tsProject  = tsc.createProject('tsconfig.json');

// lints all JS files in dev/js
gulp.task('lint', function(){
	return gulp.src(config.source)
        .pipe(config.filter.js)
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))
        .pipe(config.filter.js.restore)
        .pipe(config.filter.ts)
        .pipe(tslint())
        .pipe(tslint.reporter('default'));
});

gulp.task('js', function () {
    return gulp.src(config.source)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(config.filter.ts)
        .pipe(tsc(tsProject))
        .pipe(config.filter.ts.restore)
        .pipe(babel())
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
        .pipe(config.filter.ts)
        .pipe(tsc(tsProject))
        .pipe(config.filter.ts.restore)
        .pipe(babel())
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
