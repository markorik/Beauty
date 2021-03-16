const { src, dest, task, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

// Задача компиляции SASS в CSS
function buildSass() {
    return src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(
        postcss([
          autoprefixer({
            grid: true,
            overrideBrowserslist: ['last 2 versions'],
          }),
          cssnano(),
        ])
      )
      .pipe(sourcemaps.write('.'))
      .pipe(dest('src/css'))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream());
  }

// Задача работы с html файлами
function html() {
    return src('src/**/*.html')
      .pipe(dest('dist/'))
      .pipe(browserSync.stream());
  }

// Задача поднятия сервера
function browsersync() {
    browserSync.init({
      server: 'src/',
      notify: false,
    });
  }

// Задача отслеживания изменения файлов и запуск сервера
function serve() {
    watch('src/scss/**/*.scss', buildSass);
    watch('src/**/*.html', html);
  }

// Задачи копирования файлов
  function copy() {
    return src(['src/img/**/*.*', 'src/css/**/*.css'], {
      base: 'src/',
    }).pipe(dest('dist'));
  }
  
// Задача очистки папки Dist
  function cleanDist() {
    return del('dist/**/*', { force: true });
  }

exports.build = series(cleanDist, buildSass, html, copy);
exports.default = parallel(browsersync, serve);
//exports.default = series(buildSass, parallel(browsersync, serve));