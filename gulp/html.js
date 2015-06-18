var gulp = require('gulp');
var config = require('../gulp.config')();
var livereload = require('gulp-livereload');
// Define the task for copying html
gulp.task('html', function () {
    return gulp.src('public/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('html:watch', ['html'], function () {
    livereload.listen();
    gulp.watch('public/**/*.html', ['html'])
});

