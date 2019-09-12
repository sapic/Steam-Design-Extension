const { src, dest, parallel, series } = require('gulp');
const uglify = require('gulp-uglify');
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
            './src/js/jquery-3.3.1.min.js'
        ])
        .pipe(uglify())
        .pipe(dest('./out/build'))
}

function vernum() {
    var content = fs.readFileSync('./src/manifest.json', {
        encoding: 'utf-8'
    });
    var vernum = content.match(/\.[0-9]{2,}/g)
    fs.writeFileSync('./src/manifest.json', content.replace(vernum, (parseFloat(vernum) + 0.01).toFixed(2).replace(/^0+/, '')));
    return Promise.resolve();
}

function build() {
    return src([
            './out/build/jquery-3.3.1.min.js',
            './out/build/sapic-preview-button.js',
            './src/icon48.png',
            './src/icon128.png',
            './src/manifest.json',
            './designers.json'
        ])
        .pipe(zip('Steam-Design-Extension.zip'))
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
    vernum,
    build,
    clean
)