import glob from 'glob';
import path from 'path';

const reactPackageDirs = glob.sync('src/pivotal-ui-react/*', {realpath: true});

export default reactPackageDirs.reduce((memo, packageDir) => {
  const componentName = path.basename(packageDir);
  memo[`@npmcorp/pui-react-${componentName}\$`] = path.join(packageDir, `${componentName}.js`);
  memo[`@npmcorp/pui-react-${componentName}`] = packageDir;
  return memo;
}, {});
