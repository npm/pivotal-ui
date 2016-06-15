import gulp from 'gulp';
import handlebars from 'handlebars';
import through from 'through2';
import fs from 'fs';
import fromPackage from 'handlebars-helper-from-package';
import iconHelper from 'handlebars-helper-icon';
import svgHelper from 'handlebars-helper-svg';
import gutil from 'gulp-util';
import rename from 'gulp-rename';

handlebars.registerHelper('fromPackage', fromPackage);
handlebars.registerHelper('icon', iconHelper);
handlebars.registerHelper('svg', svgHelper);
handlebars.registerPartial('form_security', '');

gulp.task('handlebars-demos', () => {
  return gulp.src('src/styleguide/*.hbs')
    .pipe(through.obj((file, encoding, next) => {
      if (file.isNull() || file.isDirectory()) {
        return next(null, file);
      }

      if (file.isStream()) {
        return next(new gutil.PluginError({
          message: 'Streaming not supported'
        }));
      }

      const template = handlebars.compile(String(file.contents));
      const datafile = file.path.replace('hbs', 'hbsdata');

      fs.readFile(datafile, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') return next(err);
        file.contents = new Buffer(template(data ? JSON.parse(data) : {}));
        next(null, file);
      });
    }))
    .pipe(rename(path => {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('build'));
});