// Define Task for 'REV'
var gulp       = require('gulp');
var watch      = require('gulp-watch');
var config     = require('../gulp.config')();
var jshint     = require('gulp-jshint');
var karma      = require('gulp-karma');
var mocha      = require('gulp-mocha');
var istanbul   = require('gulp-istanbul');

gulp.task('before-server-test', function () {
    return gulp.src(config.serverSource)
        .pipe(istanbul(config.istanbul.start))
        .pipe(istanbul.hookRequire());  // Force `require` to return covered files
});

gulp.task('server-test', ['before-server-test'], function () {
    gulp.src(config.serverSpecs)
        .pipe(mocha(config.mocha))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        })
        .pipe(istanbul.writeReports(config.istanbul.report));
});

gulp.task('client-test', ['lint'], function () {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('test', ['client-test', 'server-test']);

gulp.task('autotest', ['client-test', 'server-test'], function () {
    watch(config.clientSource, function () {
        gulp.start('client-test');
    });
    
    watch(config.serverSource, function() {
        gulp.start('server-test')
    })
});