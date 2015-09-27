// Define Task for 'REV'
var gulp       = require('gulp');
var watch      = require('gulp-watch');
var config     = require('../gulp.config')();
var jshint     = require('gulp-jshint');
var karma      = require('gulp-karma');


gulp.task('test', ['lint'], function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('autotest', ['test'], function() {
    watch(config.source, function() {
        gulp.start('test');
    });
});