var gulp        = require('gulp'),
    prefix      = require('gulp-autoprefixer'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    smaps       = require('gulp-sourcemaps'),
    csso        = require('gulp-csso'),
    changed     = require('gulp-changed'),
    cheerio     = require('gulp-cheerio'),
    svgmin      = require('gulp-svgmin'),
    svgstore    = require('gulp-svgstore'),
    fs          = require('fs'),
    path        = require('path'),
    svgSettings = require('./.svgorc.json');

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
    SCSS = 'src/assets/scss/',
    CSS = 'demo/css',
    MINIFY = true,
    DEV = 'src/icons/development/*',
    PRO = 'src/icons/production/',
    SECTIONS = [
        'brands',
        'mdi',
        'primary-nav'
    ],
    VIEW = 'src/views',
    DEMO = 'demo/';

var render = function(layer){
    'use strict';

    var stream = gulp
        .src(SCSS + layer + '.scss')
        .pipe(smaps.init())
        .pipe(sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(prefix(BROWSERS));

    if (MINIFY) {
        stream = stream
            .pipe(csso())
            .pipe(rename({
                suffix: '.min',
                extname: '.css'
            }));
    }

    stream = stream
        .pipe(smaps.write('./'))
        .pipe(gulp.dest(CSS));

    return stream;
};

gulp.task('svgo', function(){
    'use strict';
    var stream = gulp;
    for(var i=0; i < SECTIONS.length; i++){
        stream = stream.src(DEV + '/' + SECTIONS[i])
            .pipe(changed(PRO + '/' + SECTIONS[i]))
            .pipe(svgmin(svgSettings))
            .pipe(cheerio({
                run: function ($) {
                    $('[fill]').removeAttr('fill');
                    $('[fill-rule]').removeAttr('fill-rule');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe(gulp.dest(PRO + '/' + SECTIONS[i]));
    }

    return stream;

});

gulp.task('svg-store', function(){
    'use strict';
    var stream = gulp;
    for(var i=0; i < SECTIONS.length; i++){
        stream = stream.src(PRO + '/' + SECTIONS[i])
            .pipe(changed(VIEW + '/' + SECTIONS[i] + '.html'))
            .pipe(svgstore())
            .pipe(cheerio({
                run: function ($) {
                    $('xml').remove();
                    // $('!DOCTYPE').remove();
                    $('svg').attr('class',  SECTIONS[i]);
                    $('svg').attr('style',  'position: absolute; width: 0; height: 0;');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe(rename({
                basename: SECTIONS[i],
                extname: '.html'
            }))
            .pipe(gulp.dest(VIEW));
    }

    return stream;

});

var svgClean = function(type, src, dest){
    'use strict';

    var stream = gulp
        .src(src)
        .pipe(changed(PRO + type))
        .pipe(svgmin(svgSettings))
        .pipe(rename(function(path){
            path.dirname = '/';
            // remove usless prefix/suffix.
            if (type == 'mdi') {
                path.basename = path.basename.slice(3, -5);
            }
        }))

        .pipe(gulp.dest(dest)); // PRO + 'mdi/'

    return stream;

};

var svgTemp = function(type, src, dest){
    'use strict';
    var stream = gulp
        .src(src)
        .pipe(svgstore())
        .pipe(cheerio({
            run: function ($) {
                $('xml').remove();
                // $('!DOCTYPE').remove();
                $('svg').attr('class',  type);
                $('svg').attr('style',  'position: absolute; width: 0; height: 0;');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(rename({
            basename: type,
            extname: '.html'
        }))
        .pipe(gulp.dest(dest));

    return stream;
};

gulp.task('css', function(){
    'use strict';
    render('style');
});

gulp.task('views', ['build'], function() {
    'use strict';
    var stream = gulp
        .src(VIEW + '/*.twig')
        .pipe(swig())
        .pipe(gulp.dest(DEMO));

    return stream;
});

gulp.task('watch', function(){
    'use strict';
    gulp.watch(SCSS + '**/*.scss', ['css']);
    gulp.watch(DEV, ['svgo', 'svg-store']);
    gulp.watch(VIEW + '*', ['views']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'svgo', 'svg-store', 'views', 'watch']);
