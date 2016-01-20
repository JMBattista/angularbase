// Define Task for 'REV'
var gulp       = require('gulp');
var watch      = require('gulp-watch');
var config     = require('../gulp.config')();
var jshint     = require('gulp-jshint');
var Server     = require('karma').Server;
var mocha      = require('gulp-mocha');
var istanbul   = require('gulp-istanbul');


gulp.task('pre-test', function () {
    return gulp.src(['lib/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('server-test', ['pre-test'], function () {
    return gulp.src(config.serverSpecs)
        .pipe(mocha(config.mocha))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero, but don't break autotest
            console.log(err);
        })
        .pipe(istanbul.writeReports(config.istanbul.report));
});

gulp.task('client-test', ['lint'], function (done) {
    new Server({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test', ['client-test', 'server-test']);

gulp.task('autotest', ['client-test', 'server-test'], function () {
    watch(config.clientSource, function () {
        gulp.start('client-test');
    });
    watch(config.clientSpecs, function () {
        gulp.start('client-test');
    });
    watch(config.specHelpers, function () {
        gulp.start('client-test');
    });


    watch(config.serverSource, function() {
        gulp.start('server-test');
    })

    watch(config.serverSpecs, function() {
        gulp.start('server-test');
    })
});