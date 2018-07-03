'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var uglifycss = require('gulp-uglifycss');
var minifyjs = require('gulp-js-minify');
var rename = require('gulp-rename');


gulp.task('clean', function() {
    return gulp.src('./src/css/*', {read: false})
        .pipe(clean());
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('./src/css'))
});

gulp.task('minify-css', function () { 
    gulp.src('./src/css/*.css') 
        .pipe(uglifycss({ 
            "maxLineLen": 80, 
            "uglyComments": true 
        })) 
        .pipe(gulp.dest('./src/css'));
 });  

gulp.task('minify-js', function(){ 
    gulp.src('./src/js/main.js') 
        .pipe(minifyjs())
        .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest('./src/js'));
 });

gulp.task('watch', function() { 
    gulp.watch('./src/scss/*.scss', ['sass']);
 });  

gulp.task('default', function(callback) { 
    runSequence('clean',  'sass', callback); });




