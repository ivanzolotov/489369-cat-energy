"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssmin = require('gulp-cssmin');
var server = require("browser-sync").create();

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task('buildHtml', function () {
  gulp.src('./source/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('buildFonts', function () {
  gulp.src('./source/fonts/**/*.{woff,woff2}')
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('buildImages', function () {
  gulp.src('./source/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('./build/img'));
});

gulp.task('buildStyles', function () {
  gulp.src('./source/css/style.css')
    .pipe(gulp.dest('./build/css'));
});

gulp.task("build", ["buildStyles", "buildHtml", "buildFonts", "buildImages"], function() {
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html").on("change", server.reload);
});
