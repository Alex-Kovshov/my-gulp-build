"use strict"

const {src, dest} = require("gulp");
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const gulpcssbeautify = require('gulp-cssbeautify');
const gulpcssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const gulpplumber = require("gulp-plumber");
const gulprename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
const csscomments = require("gulp-strip-css-comments");
const gulpuglify = require("gulp-uglify");
const panini = require("panini");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();



/* paths*/ 

const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html:   distPath,
        css:    distPath +'assets/css/',
        js:     distPath +'assets/js/',
        fonts:  distPath +'assets/fonts/',
        images: distPath +'assets/images/images'
    },
    src: {
        html:   srcPath + '*.html',
        css:    srcPath +'assets/scss/*.scss',
        js:     srcPath +'assets/js/*.js',
        fonts:  srcPath +'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
        images: srcPath +'assets/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xml,json}'
        
    },
    watch: {
        html:   srcPath + '**/*.html',
        css:    srcPath +'assets/scss/**/*.scss',
        js:     srcPath +'assets/js/**/*.js',
        fonts:  srcPath +'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
        images: srcPath +'assets/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xml,json}'
    }, 
    
    clean: './'+ distPath
}

function serve(){
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
}

function html(){
    panini.refresh()
    return src(path.src.html, {base: srcPath})
        .pipe(gulpplumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + 'template/layouts/',
            partials: srcPath + 'template/partials/'
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
}

function css(){
    return src(path.src.css, {base: srcPath +'assets/scss/'})
       // .pipe(sass().on('error', sass.logError))
        .pipe(gulpplumber({
            errorHandler : function(err){
                notify.onError({
                    title: 'SCSS Error',
                    message: 'Error: <%= error.message%>'
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())              
        .pipe(gulpcssbeautify())
        .pipe(dest(path.build.css))
        .pipe(gulpcssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(csscomments())
        .pipe(gulprename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))
}


function js(){
    return src(path.src.js, {base: srcPath +'assets/js/'})
    .pipe(gulpplumber({
        errorHandler : function(err){
            notify.onError({
                title: 'JS Error',
                message: 'Error: <%= error.message%>'
            })(err);
            this.emit('end');
        }
    }))
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(gulpuglify())
    .pipe(gulprename({
        suffix: '.min',
        extname: '.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({stream: true}));
}

function images(){
    return src(path.src.images, {base: srcPath +'/assets/images/*'})
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({stream: true}));
}

function fonts(){
    return src(path.src.fonts, {base: srcPath +'/assets/fonts/*'})
    .pipe(browserSync.reload({stream: true}));
}

function clean(){
    return del(path.clean)
}

function watchFiles(){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
    
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts))
const watch = gulp.parallel(build, watchFiles, serve)


exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch