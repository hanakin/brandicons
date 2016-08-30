var path        = require('path'),
    fs          = require('fs'),
    vfs         = require('vinyl-fs'),
    rename      = require('gulp-rename'),
    changed     = require('gulp-changed'),
    svgo        = require('svgo'),
    svgstore    = require('svgstore'),
    svgSettings = require('./svgo.json');


var svgRender = function(svgSRC, svgDEST, svgSettings){
    'use strict';
    vfs.src(svgSRC)
        .pipe(changed(svgDEST))
        .pipe(svgo(svgSettings))
        .pipe(vfs.dest(svgDEST));
};

var svgTFile = function(svgDEST, svgLIB){
    'use strict';
    vfs.src(svgDEST)
        .pipe(changed(svgLIB))
        .pipe(svgstore())
        .pipe(rename({
            basename: 'icons',
            extname: '.html'
        }))
        .pipe(vfs.dest(svgLIB));
};

var svgLib = function(svgSRC, svgDEST, svgLIB) {
    svgRender(svgSRC, svgDEST);
    svgTFile(svgDEST, svgLIB);
}

module.exports = svgLib;
