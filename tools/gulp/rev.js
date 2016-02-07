// Define Task for 'REV'
var gulp = require('gulp');
var config = require('../../gulp.config')();
var rev  = require('gulp-rev');

var files = [
    'assets/app.css',
    'assets/app.js',
    'assets/angular/angular.min.js',
    'assets/angular-route/angular-route.min.js'
];

gulp.task('rev', ['js', 'css'], function () {
    gulp.src(files)
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
});
