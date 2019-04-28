  "use strict";

var gulp = require("gulp");
var del = require("del");
var server = require("browser-sync").create();
var plumber = require("gulp-plumber");
var pug = require("gulp-pug");
var stylus = require("gulp-stylus");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");

var paths = {
  dirs: {
    build: "./build"
  },
  html: {
    src: "./src/pages/*.pug",
    dest: "./build",
    watch: ["./src/pages/*.pug", "./src/templates/*.pug", "./src/blocks/**/*.pug"]
  },
  css: {
    src: "./src/styles/style.styl",
    dest: "./build/css",
    watch: ["./src/blocks/**/*.styl", "./src/styles/**/*.{styl,css}", "./src/styles/*.{styl,css}"]
  },
  js: {
    src: ["./node_modules/jquery/dist/jquery.min.js", "./src/js/plugins/*.js", "./src/blocks/**/*.js", "./src/js/*.js"],
    dest: "./build/js",
    watch: ["./src/blocks/**/*.js", "./src/js/**/*.js"]
  },
  images: {
    src: "./src/blocks/**/img/",
    dest: "./build/img",
    watch: "./src/blocks/**/img/*",
    watchIcons: "./src/blocks/**/img/icons/*.svg"
  },
  fonts: {
    src: "./src/fonts/*",
    dest: "./build/fonts",
    watch: "./src/fonts/*"
  }
};

gulp.task("clean", function() {
  return del(paths.dirs.build);
});

gulp.task("html", function() {
  return gulp.src(paths.html.src)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.reload({
      stream: true
    }));
});

gulp.task("css", function() {
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(stylus({
      "include css": true
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(server.stream());
});

gulp.task("js", function() {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(server.reload({
      stream: true
    }));
});

gulp.task("sprite", function() {
  return gulp.src(paths.images.src + "icons/*.svg")
    .pipe(plumber())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task("imagesOpti", function() {
  return gulp.src(paths.images.src + "*.{jpg,png,svg}")
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(rename({
      dirname: ""
    }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(server.reload({
      stream: true
    }));
});

gulp.task("webp", function() {
  return gulp.src(paths.images.src + "*.{jpg,png}")
    .pipe(plumber())
    .pipe(webp({quality: 90}))
    .pipe(rename({
      dirname: ""
    }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(server.reload({
      stream: true
    }));
});

gulp.task("fonts", function() {
  return gulp.src(paths.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(server.reload({
      stream: true
    }));
});

gulp.task("server", function() {
  server.init({
    server: paths.dirs.build,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch(paths.html.watch, gulp.parallel("html"));
  gulp.watch(paths.css.watch, gulp.parallel("css"));
  gulp.watch(paths.js.watch, gulp.parallel("js"));
  gulp.watch(paths.images.watch, gulp.series("imagesOpti", "webp"));
  gulp.watch(paths.images.watchIcons, gulp.series("sprite", "html"));
  gulp.watch(paths.fonts.watch, gulp.parallel("fonts"));
});

gulp.task("build", gulp.series(
  "clean",
  "fonts",
  "imagesOpti",
  "webp",
  "sprite",
  "html",
  "css",
  "js"
));

gulp.task("start", gulp.series("build", "server"));
