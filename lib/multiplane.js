const File = require('vinyl');
const MD = require('markdown-it');
const P = require('bluebird');
const babylon = require('babylon');
const duplexify = require('duplexify');
const pump = P.promisify(require('pump'));
const frontmatter = require('frontmatter');
const fs = P.promisifyAll(require('fs-extra'));
const gulp = require('gulp');
const merge = require('merge2');
const path = require('path');
const postcss = require('gulp-postcss');
const prism = require('prismjs');
const pumpify = require('pumpify');
const slugify = require('slugify');
const through = require('through2').obj;

const filterStream = require('./gulp-stream-filter');
const render = require('./multiplane-render');
const exampler = require('./multiplane-exampler');

const isDoc = /^(doc\n)/;

// Prism has some quirks to run on node...
global.Prism = prism;
require('prismjs/components/prism-jsx.js');
delete global.Prism;

const assembleTree = function() {
  const categories = {};
  const all = {};

  const needparent = {};
  const errors = [];

  const md = MD({
    highlight: (code, lang) => {
      switch (lang) {
        case 'html':
        case 'html_example':
          lang = 'markup';
          break;
        case 'jsx':
        case 'react_example':
          lang = 'jsx';
          break;
      }
      if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang])
      } else {
        return '';
      }
    },
    html: true
  }).use(exampler);

  return through(function(doc, _, next) {
    doc.__html = md.render(doc.content);

    if (!doc.name) return next(new Error(`Document has no name`));
    if (all[doc.name]) return next(new Error(`Duplicate document '${doc.name}`));

    all[doc.name] = doc;

    if (needparent[doc.name]) {
      needparent[doc.name].forEach(child => {
        addChild(doc, child);
      });
      delete needparent[doc.name];
    }

    if (!doc.parent) {
      doc.categories.forEach(category => {
        if (!categories[category])
          categories[category] = [];
        categories[category].push(doc);
      });
    } else if (all[doc.parent]) {
      addChild(all[doc.parent], doc);
    } else {
      if (!needparent[doc.parent])
        needparent[doc.parent] = [];
      needparent[doc.parent].push(doc);
    }

    return next();
  }, function(done) {
    const docsWithoutParents = Object.keys(needparent);
    const errors = [];

    docsWithoutParents.forEach(name => {
      errors.push(new Error(`Missing parents: ${docsWithoutParents.join(', ')}`));
    });

    try {
      reportErrors(errors);
    } catch (e) {
      return done(e);
    }

    pairs(categories).forEach(([category, docs]) => {
      const lang = category.split('_')[0];
      const rendered = render(categories, docs, category, lang);
      this.push(new File({
        path: `${category}.html`,
        contents: new Buffer(rendered)
      }));
    });

    return done();
  });
};


function extractDoc(str) {
  const {data, content} = frontmatter(str.replace(isDoc, '').trim());
  const doc = Object.assign({}, data, {
    content
  });
  return doc
}

const extractMarkdown = require('postcss').plugin('multiplane-extract-md', (opts) => {
  const {output} = opts;

  function error(err) {
    if (output.hasErrored) return;
    output.emit('error', err);
    output.hasErrored = true;
  }

  return (css, result) => {
    // walk comments
    css.walkComments(comment => {
      if (!isDoc.test(comment.text)) return;

      const doc = extractDoc(comment.text)

      if (doc.title && !doc.name)
        doc.name = slugify(doc.title);

      if (!doc.name) {
        error(new Error(`Document has no title and no name. It starts '${comment.text.slice(0, 30)}'`));
        return;
      }

      if (doc.parent && doc.categories) {
        error(new Error(`Document has both parent and categories: '${doc.name}'`));
        return;
      }

      if (!doc.parent && !doc.categories) {
        error(new Error(`Document has no parent and no categories: '${doc.name}'`));
        return;
      }

      output.write(doc);
    });
  }
});

function reportErrors(errors) {
  if (errors.length > 1) {
    const messages = errors.map(e => `	${e.message}`).join('\n');
    throw Object.assign(new Error(`Errors:
${messages}`), {
      details: errors
    });
  } else if (errors.length == 1) {
    throw errors[0];
  }
}

function addChild(doc, child) {
  if (!doc.children)
    doc.children = [];
  doc.children.push(child);
}

function pairs(obj) {
  return Object.keys(obj).map(e => {
    return [e, obj[e]];
  });
}

function extractFromJS() {
  return through(function(e, _, next) {
    try {
      const ast = babylon.parse(String(e.contents), {
        sourceType: "module",
        plugins: [
          "asyncFunctions",
          "jsx",
          "objectRestSpread"
        ]
      });

      ast.comments.map(comment => comment.value)
        .filter(comment => isDoc.test(comment))
        .map(extractDoc)
        .forEach(doc => this.push(doc));
      next();
    } catch (err) {
      next(new Error(`Error in '${e.path}': ${err.message}`));
    }
  });
}

module.exports = function(opts) {
  const input = through();
  const cssmd = through();
  const output = assembleTree();

  pump(input, filterStream('*.css'), postcss([
    extractMarkdown({
      output: cssmd
    })
  ])).then(() => cssmd.end()).catch(err => cssmd.emit('error', err));

  const jsmd = pumpify.obj(input, filterStream('*.js'), extractFromJS())

  pump(merge(jsmd, cssmd), output);

  return duplexify.obj(input, output);
};
