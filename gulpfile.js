'use strict';
var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  sass = require('gulp-ruby-sass'),
  wiredep = require('wiredep').stream,
  react = require('gulp-react'),
  gulpif = require('gulp-if'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  useref = require('gulp-useref'),
  plumber = require('gulp-plumber'),
  htmlmin = require('gulp-htmlmin'),
  pngquant = require('imagemin-pngquant'),
  cssmin = require('gulp-minify-css'),
  runSequence = require('run-sequence');

// Watch React Files
gulp.task('watch-jsx', function () {
    return gulp.src('src/public/scripts/**/*.jsx')
      .pipe(plumber())
      .pipe(react())
      .pipe(gulp.dest('src/public/scripts/'));
});

// Watch Scss Giles
gulp.task('watch-sass', function () {
  return sass('src/public/scss/main.scss', { style: 'expanded' })
    .pipe(autoprefixer({
        // This will include support for all major browsers!
        browsers: [
            'last 3 versions',
            'Chrome > 20',
            'Firefox > 20',
            'Safari > 3.1',
            'Opera > 12.1',
            'Explorer > 11',
        ],
        cascade: false
    }))
    .pipe(gulp.dest('src/public/styles'));
});

gulp.task('watch-bower', function () {
  return gulp.src('src/public/*.html')
    .pipe(plumber())
    .pipe(wiredep({
      ignorePath: /^\/|\.\.\//,
      exclude: ['src/public/components/bootstrap-sass-official/assets/javascripts/bootstrap.js']
    }))
    .pipe(gulp.dest('src/public/'));
});

gulp.task('watch', function() {
  gulp.watch('src/public/scss/**/*.scss', ['watch-sass']);
  gulp.watch('src/bower.json', ['watch-bower']);
  // gulp.watch('src/public/scripts/**/*.jsx', ['watch-jsx']);

});

gulp.task('develop', function () {
  nodemon({
    script: 'src/bin/www',
    ext: 'js jade'
  }).on('restart', function () {
  });
});

gulp.task('dist', function () {
  nodemon({
    script: 'bin/www',
    cwd: __dirname + '/dist'
  }).on('start',function(){
    console.log('starting dist server ' + __dirname);
  }).on('restart', function () {
  }).on('error',function(){

  });
});

gulp.task('default', [
  'watch-sass',
  // 'watch-jsx',
  // 'watch-bower',
  'develop',
  'watch'
]);

//['dist']
//
// //serve the dist folder
// gulp.task('serve:dist', function() {
//     console.log("Starting serve:dist task...");
//     // This wil run all the build processes in sequence
//     // and then start the dist process when all these are completed
//     runSequence('server',
//         'index',
//         'images',
//         'fonts',
//         'views',
//         'files',
//         'dist'
//     );
// });
//
// // Server Files
// gulp.task('server', function () {
//   gulp.src(['app.js', 'package.json', 'Procfile'])
//     .pipe(gulp.dest('dist'));
// //  gulp.src('views/**/*')
// //    .pipe(gulp.dest('dist/views'));
//   gulp.src('routes/**/*')
//     .pipe(gulp.dest('dist/routes'));
//   gulp.src('bin/*')
//     .pipe(gulp.dest('dist/bin'));
// });
//
// // Views
// gulp.task('index', function() {
//   var assets = useref.assets();
//   return gulp.src('public/index.html')
//     .pipe(htmlmin())
//     .pipe(assets)
//     .pipe(gulpif('*.css', autoprefixer()))
//     .pipe(gulpif('*.css', cssmin()))
//     .pipe(gulpif('*.js', uglify()))
//     .pipe(assets.restore())
//     .pipe(useref())
//     .pipe(gulp.dest('dist/public'));
// });
//
// gulp.task('views', function () {
//   return gulp.src('public/views/**/*.html')
//     .pipe(gulp.dest('dist/public/views/'));
// });
//
// // Fonts
// gulp.task('fonts', function() {
//   return gulp.src('public/styles/fonts/*')
//     .pipe(gulp.dest('dist/public/styles/fonts'));
// });
//
// // Images
// gulp.task('images', function() {
//   return gulp.src('public/images/**/*')
//     .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, use: [pngquant()]}))
//     .pipe(gulp.dest('dist/public/images'));
// });
//
// gulp.task('files', function() {
//   return gulp.src('public/**/!(*.html)')
//     .pipe(gulp.dest('dist/public/'));
// });
//
//
// gulp.task('build', function () {
//   gulp.start('server', 'index', 'images', 'fonts', 'views','files');
//
// });
//
//
// gulp.task('deploy', function () {
//   gulp.start('build')
//     .pipe()
// });

// ************************************************
// Production Build Tasks
// ************************************************

gulp.task('public', function() {
  gulp.src(['src/public/**/{*,.ico}'])
  .pipe(gulp.dest('./dist/public'));
});

gulp.task('images', function() {
  gulp.src(['src/public/images/**/*'])
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, use: [pngquant()]}))
  .pipe(gulp.dest('./dist/public/images'));
});

gulp.task('fonts', function() {
  gulp.src(['src/public/styles/fonts/**/*'])
  .pipe(gulp.dest('./dist/public/styles/fonts'));
});

gulp.task('files', function() {
  gulp.src(['src/public/files/**/*'])
  .pipe(gulp.dest('./dist/public/files'));
});

gulp.task('routes', function() {
  gulp.src(['src/routes/**/*'])
  .pipe(gulp.dest('./dist/routes'));
});

gulp.task('bin', function() {
  gulp.src(['src/bin/**/*'])
  .pipe(gulp.dest('./dist/bin'));
});

gulp.task('app', function() {
  gulp.src(['app.js', 'src/server.js', 'src/bower.json', 'package.json'])
  .pipe(gulp.dest('./dist'));
});

gulp.task('favicon', function() {
  gulp.src(['src/public/favicon.ico'])
  .pipe(gulp.dest('./dist/public'));
});

gulp.task('html', function() {
  var assets = useref.assets();
  return gulp.src('public/**/*.html')
    .pipe(htmlmin())
    .pipe(assets)
    .pipe(gulpif('*.css', autoprefixer()))
    .pipe(gulpif('*.css', cssmin()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('./dist/public'));
});

// ************************************************
// Gulp Task Runners
// ************************************************

gulp.task('build', [
  'html',
  'favicon',
  //'public',
  'images',
  'fonts',
  'files',
  'routes',
  'bin',
  'app'
]);
