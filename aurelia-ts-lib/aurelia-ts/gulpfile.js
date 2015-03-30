var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

// build the aurelia libraries that do not reference other aurelia libraries
gulp.task('level0', function() {
    var tsResult = gulp.src([
        "lib.es6.d.ts"
        ,'./metadata/**/*.ts'
        ,'./path/**/*.ts'
        ,'./event-aggregator/**/*.ts'
        ,'./history/**/*.ts'
        ,'./route-recognizer/**/*.ts'
        ],
        {base: "."})
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

// build the aurelia libraries that depend only on level 0 aurelia libraries
gulp.task('level1', ['level0'], function() {
    var tsResult = gulp.src([
        "lib.es6.d.ts"
        ,"./output-gulp/aurelia-metadata.d.ts"
        ,"./output-gulp/metadata/*.d.ts"
        ,"./output-gulp/aurelia-path.d.ts"
        ,"./output-gulp/path/*.d.ts"
        ,"./output-gulp/aurelia-event-aggregator.d.ts"
        ,"./output-gulp/event-aggregator/*.d.ts"
        ,"./output-gulp/aurelia-history.d.ts"
        ,"./output-gulp/history/*.d.ts"
        ,"./output-gulp/aurelia-route-recognizer.d.ts"
        ,"./output-gulp/route-recognizer/*.d.ts"
        ,'./dependency-injection/**/*.ts'
        ,'./http-client/**/*.ts'
        ],
        {base: "."})
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

// build the aurelia libraries that depend only on level 0 and level 1 aurelia libraries
gulp.task('level2', ['level0', 'level1'], function() {
    var tsResult = gulp.src([
        "lib.es6.d.ts"
        ,"./output-gulp/aurelia-metadata.d.ts"
        ,"./output-gulp/metadata/*.d.ts"
        ,"./output-gulp/aurelia-path.d.ts"
        ,"./output-gulp/path/*.d.ts"
        ,"./output-gulp/aurelia-event-aggregator.d.ts"
        ,"./output-gulp/event-aggregator/*.d.ts"
        ,"./output-gulp/aurelia-history.d.ts"
        ,"./output-gulp/history/*.d.ts"
        ,"./output-gulp/aurelia-route-recognizer.d.ts"
        ,"./output-gulp/route-recognizer/*.d.ts"
        ,"./output-gulp/aurelia-dependency-injection.d.ts"
        ,"./output-gulp/dependency-injection/*.d.ts"
        ,"./output-gulp/aurelia-http-client.d.ts"
        ,"./output-gulp/http-client/*.d.ts"
        ,'./router/**/*.ts'
        ],
        {base: "."})
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

gulp.task('build', ['level0', 'level1', 'level2']);

gulp.task('scripts', function() {
    var tsResult = gulp.src([
      "lib.es6.d.ts"
      ,"./output-gulp/aurelia-metadata.d.ts"
      ,"./output-gulp/metadata/*.d.ts"
      // ,'./metadata/**/*.ts'
      // ,'./output-gulp/metadata/**/*.ts'
      // ,'./path0/**/*.ts'
      // ,'./event-aggregator/**/*.ts'
      // ,'./history/**/*.ts'
      // ,'./route-recognizer/**/*.ts'
      ,'./dependency-injection/**/*.ts'
      // ,'./http-client/**/*.ts'
      // ,'./router/**/*.ts'
      ],
      {base: "."})
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
