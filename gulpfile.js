const { src, dest, parallel, series, watch } = require('gulp');
const terser = require('gulp-terser');
const zip = require('gulp-zip');
const del = require('del');
const fs = require('fs');

function dir() {
    return src('*.*', { read: false })
        .pipe(dest('./out/build'))
}

function js() {
    return src([
        './src/js/sapic-preview-button.js',
        './src/js/jquery-3.4.1.min.js'
    ])
        .pipe(terser())
        .pipe(dest('./out/build'))
}

function jsDev() {
    return src([
        './src/js/sapic-preview-button.js',
        './src/js/jquery-3.4.1.min.js'
    ])
        .pipe(terser())
        .pipe(dest('./out/build'))
}

function build() {
    return src([
        './out/build/jquery-3.4.1.min.js',
        './out/build/sapic-preview-button.js',
        './src/icon48.png',
        './src/icon128.png',
        './src/manifest.json',
        './designers.json'
    ])
        .pipe(zip('Steam-Design-Extension.zip'))
        .pipe(dest('./out'))
}

function dev() {
    return src([
        './out/build/jquery-3.4.1.min.js',
        './out/build/sapic-preview-button.js',
        './src/icon48.png',
        './src/icon128.png',
        './src/manifest.json',
        './designers.json',
        "./src/assets/**",
    ])
        .pipe(dest('./out'))
}

function clean() {
    return del('./out/build')
}

exports.test = series(
    dir,
    js,
    build,
    clean
)

exports.default = series(
    dir,
    js,
    build,
    clean
)

exports.dev = function () {
    const devPipeline = series(
        dir,
        jsDev,
        dev,
        clean
    )

    devPipeline()

    watch('src/**', devPipeline)
}