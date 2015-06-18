// Define Task for 'REV'
var gulp = require('gulp');
var config = require('../gulp.config')();
var inject = require('gulp-inject');


gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    
   var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

   return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(sources))
        .pipe(gulp.dest(config.client));
});
