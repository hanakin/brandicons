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
STYLE = [
    SCSS = 'assets/scss/',
    CSS = 'demo/'
],
MINIFY = true,
ICONS = [
    DEV = 'icons/development/*',
    PRO = 'icons/production',
    VIEW = 'demo'
];

var render = function(layer){
    'use strict';

    var css = gulp
        .src(STYLE.SCSS + layer + '.scss')
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
        .pipe(gulp.dest(STYLE.CSS));

    return css;
}

gulp.task('css', function(){
    'use strict';
    render('style');
});

gulp.task('svgo', function(){
    'use strict';
    gulp.src(ICONS.DEV)
        .pipe(changed(ICONS.PRO))
        .pipe(svgo(svgSettings))
        .pipe(gulp.dest(ICONS.PRO));
});

gulp.task('svg-store', function(){
    'use strict';
    gulp.src(ICONS.PRO)
        .pipe(changed(ICONS.VIEW))
        .pipe(svgstore())
        .pipe(rename({
            basename: 'icons',
            extname: '.html'
        }))
        .pipe(gulp.dest(ICONS.VIEW));
});

gulp.task('watch', function(){
    'use strict';
    gulp.watch(STYLE.SCSS + '**/*.scss', ['css']);
    gulp.watch(ICONS.DEV, ['svgo', 'svg-store']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'svgo', 'svg-store', 'watch']);
