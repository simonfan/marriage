var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('concat-scss', function () {
  gulp.src([

      // Ionicons
      "_ionicons-variables",
      "_ionicons-font",
      "_ionicons-animation",
      "_ionicons-icons",


      // Variables
      "_mixins.scss",
      // "_variables.scss",

      // Base
      "_reset.scss",
      "_scaffolding.scss",
      "_type.scss",

      // Components
      // "_action-sheet.scss",
      "_backdrop.scss",
      "_bar.scss",
      "_tabs.scss",
      "_menu.scss",
      "_modal.scss",
      "_popover.scss",
      "_popup.scss",
      "_loading.scss",
      "_items.scss",
      "_list.scss",
      "_badge.scss",
      "_slide-box.scss",

      // Forms
      "_form.scss",
      "_checkbox.scss",
      "_toggle.scss",
      "_radio.scss",
      "_range.scss",
      "_select.scss",
      "_progress.scss",

      // Buttons
      "_button.scss",
      "_button-bar.scss",

      // Util
      "_animations.scss",
      "_grid.scss",
      "_util.scss",
      "_platform.scss",

    ], {
      cwd: './www/lib/ionic/scss/'
    })
    .pipe(concat('ionic.full.scss'))
    .pipe(gulp.dest('./www/scss/'));
})