const { exec } = require('child_process');
const gulp = require('gulp');
const del = require('del');
const { map, pipeline, merge, duplex } = require('event-stream');
const { setup: setupDrF, copyAssets, generateCss } = require('@npmcorp/dr-frankenstyle/dev');
const path = require('path');
const { read } = require('vinyl-file');
const webpack = require('webpack-stream');
const webpackConfig = require('../config/webpack');
const connect = require('gulp-connect');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cssnext = require('postcss-cssnext');
const postcss = require('gulp-postcss');
const multiplane = require('../lib/multiplane');
const runSequence = require('run-sequence').use(gulp);
const scss = require('postcss-scss');
const through2 = require('through2');

gulp.task('monolith-clean', callback => del(['build'], callback));

gulp.task('monolith-setup-css-cache', () => {
  return setupDrF({
    cached: false
  })
    .pipe(copyAssets())
    .pipe(gulp.dest('build/'));
});

gulp.task('monolith-build-css-from-cache', () => {
  const puiCssPrefixRegexp = /^(@npmcorp\/)?pui-css-/;
  const processPuiCssPackages = pipeline(
    map((cssDependency, callback) => {
      if (puiCssPrefixRegexp.test(cssDependency.packageName)) {
        const componentName = cssDependency.packageName.replace(puiCssPrefixRegexp, '');
        read(`src/pivotal-ui/components/${componentName}/${componentName}.scss`, callback);
      } else {
        callback();
      }
    }),

    postcss([
      cssnext()
    ], {
      syntax: scss
    }),
    sass(),

    map((file, callback) => {
      callback(null, {
        packageName: `pui-css-${path.basename(file.path, '.css')}`,
        contents: file.contents.toString()
      });
    })
  );

  const processExternalCssPackages = map((cssDependency, callback) => {
    if (!puiCssPrefixRegexp.test(cssDependency.packageName)) {
      read(cssDependency.path, function(_, file) {
        callback(null, {
          packageName: cssDependency.packageName,
          contents: file.contents.toString()
        });
      });

    } else {
      callback();
    }
  });

  const input = map((data, callback) => callback(null, data));
  const processStyleAssetsStream = duplex(input,
    merge(
      input.pipe(processExternalCssPackages),
      input.pipe(processPuiCssPackages)
    )
  );

  const css = setupDrF({
    cached: true
  })
    .pipe(generateCss(processStyleAssetsStream))
    .pipe(rename('pivotal-ui.css'));

  const js = gulp.src('./src/**/*.js');

  return merge(css, merge(js, css).pipe(multiplane()))
    .pipe(gulp.dest('build/'))
});

gulp.task('monolith-build-css-from-scratch', callback => runSequence('monolith-setup-css-cache', 'monolith-build-css-from-cache', callback));

gulp.task('monolith-html', () => gulp.src('src/styleguide/*.html')
  .pipe(gulp.dest('build'))
);

gulp.task('monolith-styleguide-css', () => gulp.src('src/styleguide/styleguide.scss')
  .pipe(postcss([
    cssnext()
  ], {
    syntax: scss
  }))
  .pipe(sass())
  .pipe(gulp.dest('build/'))
);

gulp.task('monolith-build-js', () => gulp.src('./src/pivotal-ui/javascripts/pivotal-ui.js')
  .pipe(webpack(webpackConfig()))
  .pipe(rename('pivotal-ui.js'))
  .pipe(gulp.dest('build'))
);

gulp.task('monolith-build-react-js', () => {
  const watch = Boolean(process.env.WEBPACK_WATCH);

  const task = gulp.src('./src/pivotal-ui/javascripts/pivotal-ui-react.js')
    .pipe(webpack(webpackConfig({
      watch: watch
    })))
    .pipe(rename('pivotal-ui-react.js'))
    .pipe(gulp.dest('build'));

  if (!watch) {
    return task;
  }
});

gulp.task('monolith-prism-assets', () => gulp.src('node_modules/prismjs/themes/{prism,prism-okaidia}.css')
  .pipe(gulp.dest('build/prismjs'))
);

gulp.task('monolith-styleguide-assets', () => gulp.src([
  'src/styleguide/github.css',
  'src/images/*'
]).pipe(gulp.dest('build/'))
);

gulp.task('monolith', callback => runSequence('monolith-clean', [
  'monolith-html',
  'handlebars-demos',
  'monolith-styleguide-css',
  'monolith-build-css-from-scratch',
  'monolith-build-js',
  'monolith-build-react-js',
  'monolith-prism-assets',
  'monolith-styleguide-assets',
], callback));

gulp.task('monolith-serve', ['monolith'], () => {
  connect.server({
    root: ['build'],
    port: process.env.STYLEGUIDE_PORT || 8000
  });
});

gulp.task('monolith-kill-server', () => connect.serverClose());
