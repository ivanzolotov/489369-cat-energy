"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssmin = require("gulp-cssmin");
var server = require("browser-sync").create();
var del = require("del");
var run = require("run-sequence");
var imagemin = require("gulp-imagemin");
var rename = require('gulp-rename');

gulp.task("clean", function () {
  return del("./build");
});

gulp.task("styles", function() {
  gulp.src("./source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("./source/css"))
    .pipe(cssmin())
    .pipe(gulp.dest("./build/css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  gulp.src("./source/*.html")
    .pipe(gulp.dest("./build"));
});

gulp.task("fonts", function () {
  gulp.src("./source/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest("./build/fonts"));
});

gulp.task("images", function () {
  return gulp.src("./source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
]))
    .pipe(gulp.dest("./build/img"));
});

gulp.task("build", function(done) {
  run("clean", "styles", "html", "fonts", "images", done);
});

gulp.task("serve", ["styles"], function() {
  server.init({
    server: "./source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["styles"]);
  gulp.watch("source/*.html").on("change", server.reload);
});
