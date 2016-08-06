const React = require('react');
const babel = require('babel-core');
const vm = require('vm');
const glob = require('glob');
const path = require('path');

const libs = [
  {
    React,
    require
  }
].concat(glob.sync(path.resolve(__dirname, '../src/pivotal-ui-react/*')).map(require));

const sandbox = vm.createContext(libs.reduce((a, e) => {
  if (e.default) {
    return Object.assign(a, {
      [e.default.displayName]: e.default
    });
  } else {
    return Object.assign(a, e);
  }
}, {}));

function goEval(jsx) {
  const code = babel.transform(jsx, {
    presets: ["es2015", "react", "stage-2"]
  }).code;
  return vm.runInContext(code, sandbox);
}

module.exports = function(jsx) {
  return React.renderToString(goEval(jsx));
}

module.exports.eval = goEval;
