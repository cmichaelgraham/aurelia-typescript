var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
gulp.task('scripts', function() {
    var tsResult = gulp.src('./**/*.ts')
                       .pipe(ts({
                           declarationFiles: true,
                           noExternalResolve: true,
                           target: "ES5",
                           module: "amd"
                       }));

    return merge([
        tsResult.dts.pipe(gulp.dest('output-gulp')),
        tsResult.js.pipe(gulp.dest('output-gulp'))
    ]);
});
