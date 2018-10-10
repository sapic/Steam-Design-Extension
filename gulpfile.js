var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
const zip = require('gulp-zip');
var fs = require('fs');

gulp.task('js', function(){
    gulp.src([
        './src/js/main.js',
        './src/js/jquery-3.2.1.min.js'
      ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./out/build'))
});

gulp.task('default', ['clean'], function() {
    gulp.src([
        './out/build/main.js',
        './src/icon48.png',
        './src/icon128.png',
        './src/mainifest.json'
    ])
        .pipe(zip('Steam-Design-Extension.zip'))
        .pipe(gulp.dest('./out'))
});