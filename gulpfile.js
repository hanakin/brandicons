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
    DEV = 'src/icons/development/**/*',
    PRO = 'src/icons/production/',
    VIEW = 'src/views';

function getFolders(dir){
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


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

gulp.task('css', function(){
    'use strict';
    render('style');
});

gulp.task('svgmin', function(){
    'use strict';
    gulp.src(DEV)
        .pipe(changed(PRO))
        .pipe(svgmin(svgSettings))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[fill-rule]').removeAttr('fill-rule');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest(PRO));
});

gulp.task('svg-store', function(){
    'use strict';
    var folders = getFolders(PRO);
    return folders.map(function(folder){
        return gulp.src(PRO + folder + '/*')
            // .pipe(changed(VIEW))
            .pipe(svgstore())
            .pipe(cheerio({
                run: function ($) {
                    var svg = $('svg')
                        .attr('class',  folder)
                        .attr('style',  'position: absolute; width: 0; height: 0;');
                    $.root().empty().append(svg);
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe(rename({
                basename: folder,
                extname: '.html'
            }))
            .pipe(gulp.dest(VIEW));
    });
});

gulp.task('watch', function(){
    'use strict';
    gulp.watch(SCSS + '**/*.scss', ['css']);
    gulp.watch(DEV, ['svgmin', 'svg-store']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'svgmin', 'svg-store', 'watch']);
