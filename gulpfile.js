'use strict';
var fs = require('fs')
var gulp = require('gulp')

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

gulp.task('build', ['html', 'js', 'styles', 'assets', 'fonts']);

gulp.task('watch', ['html:watch', 'js:watch', 'styles:watch', 'assets:watch', 'fonts:watch']);

gulp.task('serve-dev', ['watch', 'server:start', 'server:restart' ]);