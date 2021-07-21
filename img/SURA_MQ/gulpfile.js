const gulp = require("gulp"),
  sass = require("gulp-sass")(require("sass")),
  cleanCSS = require("gulp-clean-css"),
  connect = require("gulp-connect"),
  del = require("del"),
  browserSync = require("browser-sync").create(),
  browserify = require("browserify"),
  babelify = require("babelify"),
  buffer = require("vinyl-buffer"),
  uglify = require("gulp-uglify"),
  source = require("vinyl-source-stream"),
  tsify = require("tsify"),
  imagemin = require("gulp-imagemin");

const paths = {
  stylesBootstrap: {
    src: "src/assets/scss/bootstrap/*.scss",
    dest: "dist/assets/css/bootstrap",
  },
  styles: {
    src: "src/assets/scss/styles/**/**/*.scss",
    dest: "dist/assets/css/styles/",
  },
  scriptsBootstrap: {
    src: "src/assets/js/index.esm.js",
    dest: "dist/assets/js/",
  },
  scripts: {
    src: "src/assets/js/indexdos.js",
    dest: "dist/assets/js/",
  },
  imgs: {
    src: "src/assets/imgs/*",
    dest: "dist/assets/imgs/",
  },
};

/**
 * Build the folder assets on dist/
 * @return {Object}
 */
function clean() {
  return del(["dist/assets/css", "dist/assets/js", "dist/assets/imgs"]);
}

/**
 * Transpile Bootstrap styles /
 * @return {Object}
 */
function stylesBootstrap() {
  return gulp
    .src(paths.stylesBootstrap.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(paths.stylesBootstrap.dest));
}

/**
 * Transpile Custom styles /
 * @return {Object}
 */
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(paths.styles.dest));
}

/**
 * Transpile Bootstrap scripts /
 * @return {Object}
 */
function scriptsBootstrap() {
  return browserify(paths.scriptsBootstrap.src, {
    standalone: "Bundle",
  })
    .plugin(tsify, { target: "es6" })
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("bootstrap.bundle.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scriptsBootstrap.dest));
}

/**
 * Transpile Custom scripts /
 * @return {Object}
 */
function scripts() {
  return browserify(paths.scripts.src, {
    standalone: "Bundle",
  })
    .plugin(tsify, { target: "es6" })
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("bundle.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

function optimizeImages(done) {
  gulp.src(paths.imgs.src).pipe(imagemin()).pipe(gulp.dest(paths.imgs.dest));
  done();
}

/**
 * Observe changes in all files /
 */
function watch() {
  gulp
    .watch(paths.stylesBootstrap.src, stylesBootstrap)
    .on("change", browserSync.reload);

  gulp.watch(paths.styles.src, styles).on("change", browserSync.reload);

  gulp.watch("src/assets/js/**/*.js", scripts).on("change", browserSync.reload);

  gulp.watch("dist/**/*.html").on("change", browserSync.reload);
}

/**
 * Define baseDir folder and run local serve
 */
gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });

  watch();
});

const build = gulp.series(
  clean,
  gulp.parallel(stylesBootstrap),
  gulp.parallel(styles),
  gulp.parallel(scriptsBootstrap),
  gulp.parallel(scripts),
  gulp.parallel(optimizeImages)
  // gulp.parallel(watch),
);

exports.watch = watch;
exports.build = build;

exports.default = build;
