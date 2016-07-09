var path        = require('path'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    prefix      = require('gulp-autoprefixer'),
    sass        = require('gulp-scss'),
    rename      = require('gulp-rename'),
    smaps       = require('gulp-sourcemaps'),
    csso        = require('gulp-csso'),
    changed     = require('gulp-changed'),
    svgo        = require('gulp-svgo'),
    svgstore    = require('gulp-svgstore'),
    svgSettings = require('./svgo.json');

// Config
var BROWSERS = [
    'ie >= 11',
    'edge >= 20',
    'ff >= 40',
    'chrome >= 35',
    'safari >= 8',
    'opera >= 35',
    'ios >= 8'
],
SCSS = 'assets/scss/',
CSS = 'demo/'
MINIFY = true,
DEV = 'icons/development/*',
PRO = 'icons/production/',
VIEW = 'demo/';

var render = function(layer){
    'use strict';

    var css = gulp
        .src(SCSS + layer + '.scss')
        .pipe(smaps.init())
        .pipe(sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(prefix(BROWSERS));

    if (MINIFY) {
       css = css
       .pipe(csso())
       .pipe(rename({
           suffix: '.min',
           extname: '.css'
       }));
    }

    css = css
        .pipe(smaps.write('./'))
        .pipe(gulp.dest(CSS));

    return css;
}

gulp.task('css', function(){
    'use strict';
    render('style');
});

gulp.task('svgo', function(){
    'use strict';
    gulp.src(DEV)
        .pipe(changed(PRO))
        .pipe(svgo(svgSettings))
        .pipe(gulp.dest(PRO));
});

gulp.task('svg-store', function(){
    'use strict';
    gulp.src(PRO)
        .pipe(changed(VIEW))
        .pipe(svgstore())
        .pipe(rename({
            basename: 'icons',
            extname: '.html'
        }))
        .pipe(gulp.dest(VIEW));
});

gulp.task('watch', function(){
    'use strict';
    gulp.watch(SCSS + '**/*.scss', ['css']);
    gulp.watch(DEV, ['svgo', 'svg-store']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'svgo', 'svg-store', 'watch']);
