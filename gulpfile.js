'use strict';
var fs = require('fs')
var gulp = require('gulp')
var config = require('./gulp.config')();

fs.readdirSync(__dirname + '/gulp').forEach(function (module) {
    require(__dirname + '/gulp/' + module)
});

/** Update these based on which style tech you use */
// CSS
// gulp.task('styles', ['css']);
// gulp.task('styles:watch', ['css:watch']);

// LESS
gulp.task('styles', ['less']);
gulp.task('styles:watch', ['less:watch']);

/** Standard Tasks */

gulp.task('build', ['html', 'js', 'styles', 'assets']);

gulp.task('watch', ['html:watch', 'js:watch', 'styles:watch', 'assets:watch']);

// Start the server with full build syntax, does not watch
gulp.task('serve', ['build', 'server:start'], function() {
    config.browserSync.init({
        proxy: "localhost:8001"
    })
});

// Start the server in dev mode, and keep it up to date with watch
gulp.task('serve-dev', ['watch', 'server:start', 'server:restart' ], function() {
    config.browserSync.init({
        proxy:"localhost:8001"
    })
});