import gulp from 'gulp';
const runSequence = require('run-sequence').use(gulp);

gulp.task('setup-watchers', (callback) => {
  process.env.WEBPACK_WATCH = true;
  gulp.watch(['src/pivotal-ui/components/**/*.scss'], ['monolith-build-css-from-cache', 'monolith-styleguide-css']);
  gulp.watch(['src/pivotal-ui/components/**/*.js'], ['monolith-build-js', 'monolith-styleguide-assets']);
  gulp.watch(['src/styleguide/*.scss'], ['monolith-styleguide-css']);
  gulp.watch(['src/styleguide/**/*.js'], ['monolith-styleguide-assets']);
  callback();
});

gulp.task('dev', (callback) => runSequence(
  'setup-watchers',
  'monolith-serve',
  callback
));
