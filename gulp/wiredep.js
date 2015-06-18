// Define Task for 'REV'
var gulp = require('gulp');
var config = require('../gulp.config')();
var inject = require('gulp-inject');


gulp.task('wiredep', ['wiredep:app']);

gulp.task('wiredep:lib', function() {
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    
   var sources = gulp.src(config.source, {read: false});

   return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(sources))
        .pipe(gulp.dest(config.client));
});


gulp.task('wiredep:app', function() {
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    
   var sources = gulp.src(config.source, {read: false});

   return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(sources))
        .pipe(gulp.dest(config.client));
});
