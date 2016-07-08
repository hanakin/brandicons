var path   = require('path'),
    fs     = require('fs'),
    // del    = require('del'),
    gulp   = require('gulp'),
    ap     = require('gulp-autoprefixer'),
    sass   = require('gulp-scss'),
    rename = require('gulp-rename'),
    smaps  = require('gulp-sourcemaps'),
    csso   = require('gulp-csso'),
    svgo   = require('gulp-svgo'),
    svgstore   = require('gulp-svgstore'),
    svgSettings = require('./svgo.json');

var AUTOPREFIXER_BROWSERS = [
    'ie >= 11',
    'edge >= 20',
    'ff >= 40',
    'chrome >= 35',
    'safari >= 8',
    'opera >= 35',
    'ios >= 8'
];

var icons = [
    {
        name: 'test',
        icon: 'contents'
    }
];

// Config
var guide = {
    css: 'guide/assets/css',
    fonts: 'guide/assets/fonts',
    imgs: 'guide/assets/imgs',
    js: 'guide/assets/js'
};

var theme = {
    css: 'docs/assets/css',
    fonts: 'docs/assets/fonts',
    imgs: 'docs/assets/imgs',
    js: 'docs/assets/js'
};

var minify = true;

var buildIcons = function(){
    // get file

    // get filename
    var filename;

    // convert to symbol
    // add id
}


var render = function(layer){
    'use strict';

    var css = gulp
        .src('./guide/assets/scss/' + layer + '.scss')
        .pipe(smaps.init())
        .pipe(sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(ap(AUTOPREFIXER_BROWSERS));

    if (minify) {
       css = css
       .pipe(csso())
       .pipe(rename({
           suffix: '.min',
           extname: '.css'
       }));
    }

    css = css
        .pipe(smaps.write('./'))
        .pipe(gulp.dest(theme.css));

    return css;
}

gulp.task('css', function(){
    'use strict';
    render('style');
});

gulp.task('svgo', function(){
    'use strict';
    gulp.src('icons/development/*.svg')
        .pipe(svgo(svgSettings))
        .pipe(gulp.dest('icons/production'));
});

gulp.task('svg-store', function(){
    'use strict';
    gulp.src('icons/production/*.svg')
        .pipe(svgstore())
        .pipe(rename({
            basename: 'icons',
            extname: '.twig'
        }))
        .pipe(gulp.dest('docs/views'));
});

gulp.task('clean', function(){
    'use strict';
    del(['guide']);
    del([theme.css]);
});

gulp.task('watch', function(){
    'use strict';
    gulp.watch('docs/assets/**/*.scss', ['css']);
    gulp.watch('icons/development/*', ['svgo', 'svg-store']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'svgo', 'svg-store', 'watch']);
