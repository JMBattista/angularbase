// Define Task for 'REV'
var gulp       = require('gulp');
var watch      = require('gulp-watch');
var config     = require('../../gulp.config')();
var jshint     = require('gulp-jshint');
var Server     = require('karma').Server;
var mocha      = require('gulp-mocha');
var istanbul   = require('gulp-istanbul');

gulp.task('server-test', function () {
    return buildServerTests(context => process.exit(1))();
});

gulp.task('client-test', ['lint'], function (done) {
    new Server({
        configFile: __dirname + '/../../karma.conf.js',
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


    watch(config.serverSource, buildServerTests(context => context.emit('end')));

    watch(config.serverSpecs, buildServerTests(context => context.emit('end')));
});

function buildServerTests(onfail) {
    return function() {
        return gulp.src(config.serverSource)
            .pipe(istanbul(config.istanbul.start))
            .pipe(istanbul.hookRequire()) // Force `require` to return covered files
            .on('finish', function () {
                    gulp.src(config.serverSpecs)
                        .pipe(mocha(config.mocha))
                        .on('error', function (err) {
                            // Make sure failed tests cause gulp to exit non-zero
                            console.log(err);
                            onfail(this);
                        })
                        .pipe(istanbul.writeReports(config.istanbul.report));
            });
    };
}
