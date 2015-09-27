var gulp       = require('gulp');
var config     = require('../gulp.config')();
var watch      = require('gulp-watch');
var concat     = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber    = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var livereload = require('gulp-livereload');
var jshint     = require('gulp-jshint');
var jscs       = require('gulp-jscs');
var tslint     = require('gulp-tslint');
var using      = require('gulp-using');
var tsc        = require('gulp-typescript');
var babel      = require('gulp-babel');
var tsProject  = tsc.createProject('tsconfig.json');

var filter = require('gulp-filter');

// lints all JS files in dev/js
gulp.task('lint', function(){
    var js = config.filter.js();
    var ts = config.filter.ts();

	return gulp.src(config.source)
        .pipe(plumber())
        .pipe(js)
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs())
        .pipe(js.restore)
        .pipe(ts)
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
        .pipe(ts.restore)
});

gulp.task('js', function () {
    var ts = config.filter.ts();

    return gulp.src(config.source)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ts)
        .pipe(tsc(tsProject))
        .pipe(ts.restore)
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(livereload());
});

gulp.task('js-dev', function () {
    var ts = config.filter.ts();

    return gulp.src(config.source)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ts)
        .pipe(tsc(tsProject))
        .pipe(ts.restore)
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
