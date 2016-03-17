'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'src/server/app.js',

    // watch core server file(s) that require server restart on change
    watch: ['app.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
        console.log("Attempting Restart");
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
          console.log("Restarted Browser Sync.");
        browserSync.reload({
          stream: true
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    // open the proxied app in chrome
    browser: ['google-chrome']
  });
});

gulp.task('js',  function () {
  return gulp.src('src/scripts/**/*.js')
    // do stuff to JavaScript files
    .pipe(uglify())
    .pipe(gulp.dest('src/client/js-min'));
});

gulp.task('sass', function () {
	return gulp.src('src/scss/**/*.scss')
	.pipe(sass({outputStyle: 'compressed', sourceComments: 'map'}, {errLogToConsole: true}))
	.pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
	.pipe(gulp.dest('src/client/css'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('src/scripts/**/*.js',   ['js', browserSync.reload]);
  gulp.watch('src/scss/**/*.scss',  ['sass']);
  // gulp.watch('public/**/*.css',  ['css']);
  gulp.watch('src/client/**/*.html', ['bs-reload']);
});
