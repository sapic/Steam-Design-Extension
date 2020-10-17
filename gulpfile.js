const { src, dest, parallel, series, watch } = require('gulp');
const gulpEsbuild = require('gulp-esbuild')
const zip = require('gulp-zip');
const rename = require("gulp-rename");

const del = require('del');
const fs = require('fs');

function dir() {
    return src('*.*', { read: false })
        .pipe(dest('./out/build'))
}

function js() {
    return src([
        './src/js/index.js',
    ])
        .pipe(gulpEsbuild({
            outfile: 'bundle.js',
            bundle: true,
            minify: true,
            target: 'es6',
        }))
        .pipe(dest('./out/build'))
}

function jsDev() {
    return src([
        './src/js/index.js',
    ])
        .pipe(gulpEsbuild({
            outfile: 'bundle.js',
            bundle: true,
            target: 'es6',
        }))
        .pipe(dest('./out/build'))
}

function build() {
    return src([
        './out/build/bundle.js',
        './src/icon48.png',
        './src/icon128.png',
        './src/manifest.json',
        "./src/assets/**",
    ])
        .pipe(zip('Steam-Design-Extension.zip'))
        .pipe(dest('./out'))
}

function dev() {
    return src([
        './out/build/bundle.js',
        './src/js/hot-reload.js',
        './src/icon48.png',
        './src/icon128.png',
        "./src/assets/**",
    ])
        .pipe(dest('./out'))
}

function devManifest() {
    return src("./src/manifest_dev.json")
        .pipe(rename('manifest.json'))
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
        devManifest,
        clean
    )

    devPipeline()

    watch('src/**', devPipeline)
}