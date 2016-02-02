import {exec} from 'child_process';
import path from 'path';
import promisify from 'es6-promisify';
import {gt} from 'semver';
import {log} from 'gulp-util';


async function filterPackages(packageInfos, packageInfo) {
  const {name, version: localVersion, dir} = packageInfo;

  try {
    const publishedVersion = (await promisify(exec)(`npm show ${name} version`)).trim();

    if (gt(localVersion, publishedVersion)) {
      log('Publishing: ', name, dir);
      (await packageInfos).push(packageInfo);
    } else {
      log('Skipping: ', name, dir);
    }
  } catch (e) {
    if (e.message.match(/npm show/)) {
      log(`Warning: ${name} is not published`);
    } else {
      console.error(e.stack);
    }
  }

  return packageInfos;
}

export function getPackageInfo(file) {
  const {name, version} = JSON.parse(file.contents.toString());

  return {
    name: name,
    version: version,
    dir: path.dirname(file.path)
  };
}

export async function infoForUpdatedPackages(files) {
  const packageInfos = files.map(getPackageInfo);

  return await packageInfos.reduce(filterPackages, []);
}
