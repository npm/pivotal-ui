import { exec } from 'child_process';
import gulp from 'gulp';
import del from 'del';
import { map, pipeline, merge, duplex } from 'event-stream';
import { setup as setupDrF, copyAssets, generateCss } from '@npmcorp/dr-frankenstyle/dev';
import { railsUrls } from '@npmcorp/dr-frankenstyle';
import path from 'path';
import { read } from 'vinyl-file';
import webpack from 'webpack-stream';
import webpackConfig from '../config/webpack';

const connect = require('gulp-connect');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cssnext = require('postcss-cssnext');
const postcss = require('gulp-postcss');
const multiplane = require('../lib/multiplane');
const runSequence = require('run-sequence').use(gulp);
const scss = require('postcss-scss');

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

  return setupDrF({
    cached: true
  })
    .pipe(generateCss(processStyleAssetsStream))
    .pipe(multiplane.gulp({
        destination: 'build'
    }))
    .pipe(rename('pivotal-ui.css'))
    .pipe(gulp.dest('build/'))
    .pipe(railsUrls())
    .pipe(rename('pivotal-ui-rails.css'))
    .pipe(gulp.dest('build/'));
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

gulp.task('monolith-build-styleguide-react-js', () => {
  const watch = Boolean(process.env.WEBPACK_WATCH);

  const task = gulp.src('./src/styleguide/styleguide-react.js')
    .pipe(webpack(webpackConfig({
      watch: watch
    })))
    .pipe(rename('styleguide-react.js'))
    .pipe(gulp.dest('build/styleguide'));

  if (!watch) {
    return task;
  }
});

gulp.task('monolith-prism-assets', () => gulp.src('node_modules/prismjs/themes/{prism,prism-okaidia}.css')
    .pipe(gulp.dest('build/prismjs'))
);

gulp.task('monolith-styleguide-assets', () => gulp.src([
    'src/styleguide/*.js',
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
    'monolith-build-styleguide-react-js',
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
