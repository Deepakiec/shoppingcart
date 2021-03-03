const
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    noop = require('gulp-noop'),

    devBuild = (process.env.NODE_ENV !== 'production'), //dev build

    src = 'src/',
    build = 'dist/'
    ;

const concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    terser = require('gulp-terser'),
    stripdebug = devBuild ? null : require('gulp-strip-debug'),
    sourcemap = devBuild ? require('gulp-sourcemaps') : null;

const htmlclean = require('gulp-htmlclean');

const sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano');

function imagesProcess() { 

    const out = build + 'images/'; 

    return gulp.src(src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));

};

function jsProcess() {
    const out = build + 'js/';

    return gulp.src(src + 'js/**/*') // js folder location
        .pipe(sourcemap ? sourcemap.init() : noop()) // sourcempa
        .pipe(deporder()) // dependency check
        .pipe(concat('main.js')) // concat main.js file
        .pipe(stripdebug ? stripdebug() : noop())
        .pipe(terser()) // minimize code with es6 compatable code
        .pipe(sourcemap ? sourcemap.write() : noop()) // call at last becuse complete all task the execute
        .pipe(gulp.dest(out))
}

function htmlProcess() {
    console.log('env is:: ', process.env.NODE_ENV);
    const out = build + 'html/';
    return gulp.src(src + 'html/**/*')
        .pipe(newer(out))
        .pipe(devBuild ? noop() : htmlClean())
        .pipe(gulp.dest(build))
}

function cssProcess() {
    const out = build + 'css/';
    const cssOut=src +'css/';

    return gulp.src(src + 'scss/**/*')
        .pipe(sourcemap ? sourcemap.init() : noop())
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: '/images/',
            precision: 3,
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(postcss([
            assets({ loadPaths: ['images/'] }),
            autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
            mqpacker,
            cssnano
        ]))
        .pipe(sourcemap ? sourcemap.write() : noop())
        .pipe(gulp.dest(out))
        .pipe(gulp.dest(cssOut));
}

exports.js = jsProcess;

exports.images = imagesProcess;

exports.html = htmlProcess;

exports.css = cssProcess;

exports.build_app = gulp.series(imagesProcess, cssProcess, jsProcess, htmlProcess);
