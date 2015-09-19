'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var fs = require("fs");
var gutil = require("gulp-util");
var gulpJsdoc2md = require("gulp-jsdoc-to-markdown");
var concat = require("gulp-concat");


var mainSources = [
  './index.js',
  './lib/**/!(*.spec).js'
];

var testSources = [
  './index.spec.js',
  './lib/**/*.spec.js'
];

var jsSources = mainSources.concat(testSources);

gulp.task('jshint', function () {
  return gulp.src(jsSources, testSources)
  .pipe(cache('jshint'))
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function () {
  return gulp.src(jsSources)
  .pipe(cache('jscs'))
  .pipe(jscs());
});

gulp.task('lint', ['jshint', 'jscs']);

function testTask() {
   return gulp.src(testSources, testSources)
  .pipe(cache('test'))
  .pipe(mocha({ reporter: 'spec' }));
}

gulp.task('test', testTask);

gulp.task('cover', function (done) {
  gulp.src(mainSources)
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire())
  .on('finish', function () {
    testTask()
    .pipe(mocha())
    .pipe(istanbul.writeReports({ dir: './~coverage' }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .on('end', done);
  });

});


gulp.task("docs", function() {
  return gulp.src("lib/*.js")
  .pipe(concat("README.md"))
  .pipe(gulpJsdoc2md({ template: fs.readFileSync("./readme.hbs", "utf8") }))
  .on("error", function(err){
    gutil.log("jsdoc2md failed:", err.message);
  })
  .pipe(gulp.dest("."));
});


