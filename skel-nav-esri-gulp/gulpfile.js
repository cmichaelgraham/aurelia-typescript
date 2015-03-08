var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var tsc = require('gulp-typescript-compiler');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var yuidoc = require("gulp-yuidoc");
var changelog = require('conventional-changelog');
var assign = Object.assign || require('object.assign');
var fs = require('fs');
var bump = require('gulp-bump');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var tools = require('aurelia-tools');

var path = {
  sourceTS: './views/**/*.ts',
  html:'./**/*.html',
  style:'./styles/**/*.css',
  output:'./views'
};

var compilerOptions = {
  filename: '',
  filenameRelative: '',
  blacklist: [],
  whitelist: [],
  modules: '',
  sourceMap: true,
  sourceMapName: '',
  sourceFileName: '',
  sourceRoot: '',
  moduleRoot: '',
  moduleIds: false,
  runtime: false,
  experimental: false,
  format: {
    comments: false,
    compact: false,
    indent: {
      parentheses: true,
      adjustMultilineComment: true,
      style: "  ",
      base: 0
    }
  }
};

var jshintConfig = {esnext:true};

gulp.task('build-amd', function () {
    return gulp.src(path.sourceTS)
        .pipe(plumber())
        .pipe(tsc({
            module: 'amd',
            target: 'ES5',
            sourcemap: false,
            logErrors: true
        }))
        .pipe(gulp.dest(path.output))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', function(callback) {
  return runSequence(
    'build-amd',
    callback
  );
});

gulp.task('serve', ['build'], function(done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch', ['serve'], function() {
  gulp.watch(path.sourceTS, ['build-amd', browserSync.reload]).on('change', reportChange);
  gulp.watch(path.html, [browserSync.reload]).on('change', reportChange);
  gulp.watch(path.style, [browserSync.reload]).on('change', reportChange);
});
