import {map, pipeline} from 'event-stream';
import gulp from 'gulp';
import path from 'path';

export function releaseDest(folderName='') {
  const prefixReleaseToDestStream = map(async (file, callback) => {
    try {
      if (folderName) file.path = path.join(file.base, folderName, file.relative);
      callback(null, file);
    }
    catch(e) {
      console.error(error.stack);
      callback(e);
    }
  });

  return pipeline(
    prefixReleaseToDestStream,
    gulp.dest('release/')
  );
}
