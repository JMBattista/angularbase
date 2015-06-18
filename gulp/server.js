var gulp   = require('gulp');
var config = require('../gulp.config')();
var server = require('gulp-develop-server');

// run server
gulp.task('server:start', function() {
    server.listen( { path: './src/server/server.js', execArgv: ['--harmony'] } );
});

// restart server if app.js changed
gulp.task( 'server:restart', function() {
    gulp.watch(['./src/server/server.js', './src/server/routes/**/*.js' ], server.restart );
});