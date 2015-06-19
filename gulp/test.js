// Define Task for 'REV'
var gulp = require('gulp');
var config = require('../gulp.config')();
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var karma = require('gulp-karma');

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    return gulp
        .src(config.source)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
});


gulp.task('test', ['vet'], function() {
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

gulp.task('autotest', function() {
    return gulp.watch(config.source, ['test']);
});