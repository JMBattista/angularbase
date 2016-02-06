var gulp       = require('gulp');
var config     = require('../gulp.config')();
var watch      = require('gulp-watch');
var concat     = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber    = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var jshint     = require('gulp-jshint');
var jscs       = require('gulp-jscs');
var tslint     = require('gulp-tslint');
var using      = require('gulp-using');
var tsc        = require('gulp-typescript');
var babel      = require('gulp-babel');
var tsProject  = tsc.createProject('tsconfig.json');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

var filter = require('gulp-filter');

// lints all JS files in dev/js
gulp.task('lint', function(){
    var js = config.filter.js();
    var ts = config.filter.ts();

	return gulp.src(config.clientSource)
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

    return gulp.src(config.clientSource)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(ts)
                .pipe(tsc(tsProject))
            .pipe(ts.restore)
            .pipe(babel())
            .pipe(ngAnnotate())
            .pipe(concat('app.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(config.browserSync.stream());
});

gulp.task('js:watch', function () {
    processJavascriptDev();
    watch(config.clientSource, function(vinyl) {
        if (vinyl.event === 'unlink') {                   // if a file is deleted, forget about it
            delete cached.caches.scripts[vinyl.path];       // gulp-cached remove api
            remember.forget('scripts', vinyl.path);         // gulp-remember remove api
        }

        processJavascriptDev();
    });
});

function processJavascriptDev() {
    var ts = config.filter.ts();

    return gulp.src(config.clientSource)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(cached('scripts'))
            .pipe(ts)
                .pipe(tsc(tsProject))
            .pipe(ts.restore)
            .pipe(babel())
            .pipe(ngAnnotate())
            .pipe(remember('scripts'))
            .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest + 'js/'))
        .pipe(config.browserSync.stream());
};
