import { src, dest, series, watch } from 'gulp';
import gulpEsbuild from 'gulp-esbuild';
import zip from 'gulp-zip';
import rename from "gulp-rename";
import { deleteAsync } from 'del';
import fs from 'fs';

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
            define: {
                'process.env.NODE_ENV': '"production"'
            },
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
            minify: true,
            target: 'es6',
            define: {
                'process.env.NODE_ENV': '"production"'
            },
            jsxFactory: 'preact.h',
            jsxFragment: 'preact.Fragment',
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
            jsxFactory: 'preact.h',
            jsxFragment: 'preact.Fragment',
        }))
        .pipe(dest('./out/build'))
}

function buildZIP() {
    return src([
        './out/build/bundle.js',
        './out/build/massUpload.js',
        './src/massUpload.css',
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
        './src/massUpload.css',
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
        './src/massUpload.css',
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
    return deleteAsync('./out/build');
}

export const build = series(
    dir,
    js,
    uploadJs,
    buildFF,
    buildZIP,
    clean
)

export const devtest = function () {
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

export default build
