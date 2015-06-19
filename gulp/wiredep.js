// Define Task for 'REV'
var gulp = require('gulp');
var config = require('../gulp.config')();
var inject = require('gulp-inject');


gulp.task('wiredep', ['wiredep:script', 'wiredep:style']);

gulp.task('wiredep:style', function() {
    var wiredep = require('wiredep').stream;
    var options = config.wiredep();
    
   var sources = gulp.src("**/*.css", {read: false});

   return gulp
        .src(config.index)
        .pipe(wiredep(options))
        // .pipe(inject(sources))
        .pipe(gulp.dest(config.client));
});


gulp.task('wiredep:script', function() {
    var wiredep = require('wiredep').stream;
    var options = config.wiredep();
    
   var sources = gulp.src(config.source, {read: false});

   return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(sources))
        .pipe(gulp.dest(config.client));
});
