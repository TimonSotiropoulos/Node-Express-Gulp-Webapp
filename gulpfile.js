var gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer-core'),
  autoprefixers = require('gulp-autoprefixer'),
  mqpacker = require('css-mqpacker'),
  csswring = require('csswring'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  gulpif = require('gulp-if'),
  livereload = require('gulp-livereload'),
  useref = require('gulp-useref'),
  sass = require('gulp-ruby-sass'),
  htmlmin = require('gulp-htmlmin'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  _ = require('underscore'),
  sourcemaps = require('gulp-sourcemaps');


var app = {
  dev:'src',
  prod:'dist'
};

var getPath = function (path) {
  var appendDevPath = function (aPath) {

    if(aPath.substring(0,1) !== "/") {
      aPath =  '/' + aPath
    }

    return app.dev + aPath;
  };

  var paths = [].concat( path );
  var srcPaths = _.map(paths,appendDevPath);
  //console.log(srcPaths);
  return srcPaths;
};

// ************************************************
// Sass & Css Tasks
// ************************************************

// Add cross browser compatiability
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker,
    csswring
  ];

  return gulp.src(getPath('/public/styles/main.css'))
    .pipe(postcss(processors))
    .pipe(gulp.dest(app.dev + '/public/styles/'))
    .pipe(livereload());
});

gulp.task('sass', function () {

  gulp.task('sass', function() {
      return sass('src/public/scss/main.scss',{sourcemap: true, style: 'compact'})
          .on('error', function (err) {
            console.error('Error!', err.message);
          })
          .pipe(gulp.dest('src/public/styles'))
          .pipe(sourcemaps.init())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('src/public/styles'))
          .pipe(livereload());
  });
// return  gulp.src('template/scss/**/*.scss')
//     .pipe(sourcemaps.init())
//    .pipe(sass('src/public/styles/*.scss', {sourcemap: true, style: 'compact'}))
//   //  .pipe(sourcemaps.init())
//     .pipe(sourcemaps.write())
//     .on('error', function (err) {
//             console.error('Error!', err.message);
//         })
//     .pipe(gulp.dest(app.dev + '/public/styles/'))
//     .pipe(livereload());
});


// ************************************************
// Gulp Watch Tasks
// ************************************************

gulp.task('watch', function() {
  gulp.watch(getPath('/public/scss/**/*.scss'), ['sass']);
});

gulp.task('develop', function () {
  livereload.listen({basePath:app.dev});
  nodemon({
    script: 'bin/www',
    cwd: __dirname + '/' + app.dev,
    ext: 'scss js jade coffee',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname + '/' + app.dev);
    }, 500);
  });
});


// ************************************************
// Production Build Tasks
// ************************************************

gulp.task('public', function() {
  gulp.src(getPath(['public/**/{*,.ico}']))
  .pipe(gulp.dest('./dist/public'));
});

gulp.task('images', function() {
  gulp.src(getPath(['public/images/**/*']))
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, use: [pngquant()]}))
  .pipe(gulp.dest('./dist/public/images'));
});

gulp.task('fonts', function() {
  gulp.src(getPath(['public/styles/fonts/**/*']))
  .pipe(gulp.dest('./dist/public/styles/fonts'));
});

gulp.task('files', function() {
  gulp.src(getPath(['public/files/**/*']))
  .pipe(gulp.dest('./dist/public/files'));
});

gulp.task('routes', function() {
  gulp.src(getPath(['routes/**/*']))
  .pipe(gulp.dest('./dist/routes'));
});

gulp.task('bin', function() {
  gulp.src(getPath(['bin/**/*']))
  .pipe(gulp.dest('./dist/bin'));
});

gulp.task('app', function() {
  gulp.src(getPath(['app.js', 'server.js', 'bower.json', 'package.json', 'web.config']))
  .pipe(gulp.dest('./dist'));
});

gulp.task('favicon', function() {
  gulp.src(getPath(['public/favicon.ico']))
  .pipe(gulp.dest('./dist/public'));
});

gulp.task('html', function() {
  var assets = useref.assets();
  return gulp.src(getPath('public/**/*.html'))
    .pipe(htmlmin())
    .pipe(assets)
    .pipe(gulpif('*.css', autoprefixers()))
    .pipe(gulpif('*.css', cssmin()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('./dist/public'));
});

// ************************************************
// Server Running Tasks
// ************************************************

gulp.task('serve:dist', ['build','dist']);

gulp.task('dist', function () {
  nodemon({
    script: 'bin/www',
    cwd: __dirname + '/dist'
  }).on('start',function(){
    console.log('starting dist server ' + __dirname+ '/dist');
  }).on('restart', function () {
  }).on('error',function(){

  });
});

// ************************************************
// Gulp Task Runners
// ************************************************

gulp.task('default', [
  'sass',
  'develop',
  'watch',
  'css',
]);

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
