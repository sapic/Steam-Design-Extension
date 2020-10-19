const { src, dest, series, watch } = require('gulp');
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

function uploadJs() {
    return src([
        './src/js/massUpload.jsx',
    ])
        .pipe(gulpEsbuild({
            outfile: 'massUpload.js',
            bundle: true,
            target: 'es6',
            define: {
                'process.env.NODE_ENV': '"production"'
            },
        }))
        .pipe(dest('./out/build'))
}

function uploadJsDev() {
    return src([
        './src/js/massUpload.jsx',
    ])
        .pipe(gulpEsbuild({
            outfile: 'massUpload.js',
            bundle: true,
            target: 'es6',
            define: {
                'process.env.NODE_ENV': '"development"'
            },
        }))
        .pipe(dest('./out/build'))
}

function buildZIP() {
    return src([
        './out/build/bundle.js',
        './out/build/massUpload.js',
        './src/icon48.png',
        './src/icon128.png',
        './src/manifest.json',
        "./src/assets/**",
    ])
        .pipe(zip('Steam-Design-Extension.zip'))
        .pipe(dest('./out-zip'))
}

function buildFF() {
    return src([
        './out/build/bundle.js',
        './out/build/massUpload.js',
        './src/manifest.json',
        './src/icon48.png',
        './src/icon128.png',
        "./src/assets/**",
    ])
        .pipe(dest('./out'))
}

function dev() {
    return src([
        './out/build/bundle.js',
        './src/js/hot-reload.js',
        './out/build/massUpload.js',
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

exports.default = series(
    dir,
    js,
    uploadJs,
    buildFF,
    buildZIP,
    clean
)

exports.dev = function () {
    const devPipeline = series(
        dir,
        jsDev,
        uploadJsDev,
        dev,
        devManifest,
        clean
    )

    devPipeline()

    watch('src/**', devPipeline)
}