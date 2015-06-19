var gulp   = require('gulp');
var config = require('../gulp.config')();
var server = require('gulp-develop-server');

// run server
gulp.task('server:start', function() {
    server.listen( { path: './src/server/app.js', execArgv: ['--harmony'] } );
});

// restart server if anything changed
gulp.task( 'server:restart', function() {
    gulp.watch(['./src/server/**/*.js' ], server.restart );
});