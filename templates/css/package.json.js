var packageTemplate = function(name, overrides) {
  const packageJsonContents = Object.assign({
    name: `@npmcorp/pui-css-${name}`,
    style: `${name}.css`,
    version: '0.0.1',
    description: `${name} css component for the npm fork of Pivotal UI, based on Bootstrap`,
    repository: {
      type: 'git',
      url: 'https://github.com/npm/pivotal-ui.git'
    },
    keywords: [
      'bootstrap',
      'pivotal ui',
      'pivotal ui modularized',
      'css'
    ],
    author: 'npm, Inc',
    license: 'MIT',
    bugs: {
      url: "https://github.com/npm/pivotal-ui/issues"
    },
    homepage: "https://github.com/npm/pivotal-ui"
  }, overrides);

  if (!packageJsonContents.style) {
    delete packageJsonContents.style;
  }

  return JSON.stringify(packageJsonContents, null, 2);
};

module.exports = packageTemplate;
