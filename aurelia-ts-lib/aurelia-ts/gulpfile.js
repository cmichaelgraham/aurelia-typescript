var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
gulp.task('scripts', function() {
    var tsResult = gulp.src([
      "lib.es6.d.ts",
      "./output-gulp/aurelia.d.ts",
      './metadata/**/*.ts',
      './dependency-injection/**/*.ts',
      './event-aggregator/**/*.ts',
      './history/**/*.ts',
      './path/**/*.ts',
      // './http-client/**/*.ts',
      './route-recognizer/**/*.ts',
      // './router/**/*.ts',
      "!./node_modules/**/*.ts",
      "!./output/**/*.ts"], {base: "."})
                       .pipe(ts({
                           declarationFiles: true,
                           noExternalResolve: true,
                           target: "es6"
                       }));

    return merge([
        tsResult.dts.pipe(gulp.dest('output-gulp')),
        tsResult.js.pipe(gulp.dest('output-gulp'))
    ]);
});
