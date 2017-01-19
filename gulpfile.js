var gulp    = require('gulp');
var jshint  = require('gulp-jshint');

// task for linting js files
gulp.task('js', function() {

    return gulp.src(['server.js', 'app/*.js', 'app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});