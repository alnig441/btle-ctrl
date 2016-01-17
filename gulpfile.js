var gulp = require('gulp');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var gutil - require('gulp-util');

var paths = {
    enter: [{scripts: './development/scripts/*.js'}, {templates: './development/templates/*.jade'}, {styles: './development/styles/*.css'}, {images: './development/images/*.*'}],
    exit: [{scripts: './public/scripts/'}, {templates: './public/views/'}, {styles: './public/styles/'}, {images: './public/images/'}]
};

gulp.task('watch', ['templates'], function(){

});

gulp.task('templates', function(){
    gulp.src(path.enter.templates)
        .pipe(jade)
        .pipe(gulp.dest(path.exit.templates))
});

gulp.task('default', ['watch', 'templates']);
