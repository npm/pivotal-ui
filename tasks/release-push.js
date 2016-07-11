import { log } from 'gulp-util';
import { exec } from 'child_process';
import promisify from 'es6-promisify';
import gulp from 'gulp';
import { infoForUpdatedPackages, publishPackages } from './helpers/publish-helper';
import runSequence from 'run-sequence';
import glob from 'glob';
import fs from 'fs';

const execPromise = promisify(exec);

gulp.task('set-styleguide-env-to-production', () => process.env.STYLEGUIDE_ENV = 'production');

gulp.task('release-push-git-verify', async () => {
  const currentSha = await execPromise('git rev-parse HEAD');
  const masterSha = await execPromise('git rev-parse master');
  if (currentSha !== masterSha) {
    log('Error: You must be on master.');
    process.exit(1);
  }

  try {
    await execPromise('git diff --quiet && git diff --cached --quiet');
  } catch (e) {
    log('Error: You have uncommitted changes.');
    process.exit(2);
  }

  return execPromise('git fetch origin');
});

gulp.task('release-push-npm-publish', ['css-build', 'react-build'], async() => {
  const files = glob.sync('dist/{css,react}/*/package.json', {
    realpath: true
  })
    .map((filepath) => {
      return {
        contents: fs.readFileSync(filepath),
        path: filepath
      };
    });
  const packageInfos = await infoForUpdatedPackages(files);

  await publishPackages()(packageInfos);
});

gulp.task('release-push-git', async () => {
  const {version} = require('../package.json');
  log(`Cutting tag v${version}`);
  await execPromise(`git tag v${version}`);
  log('Pushing to origin/master');
  await execPromise('git push origin master');
  log('Pushing new tag');
  return await execPromise(`git push origin v${version}`);
});

gulp.task('release-push-production-styleguide', (done) => {
  const deployProcess = exec('git push origin +master:deploy-production');
  deployProcess.stdout.pipe(process.stdout);
  deployProcess.stderr.pipe(process.stderr);
  deployProcess.on('exit', (code) => {
    if (code) {
      process.exit(code);
    }
    done();
  });
});

gulp.task('release-push', (done) => runSequence(
  'set-styleguide-env-to-production',
  'release-push-git-verify',
  'release-push-npm-publish',
  'monolith',
  ['release-push-git', 'release-push-production-styleguide'],
  done
));