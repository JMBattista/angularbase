var gulp  = require('gulp');
var config = require('../gulp.config')();
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src(config.dest, {read: false})
        .pipe(clean());
});