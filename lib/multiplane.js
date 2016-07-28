const File = require('vinyl');
const MD = require('markdown-it');
const P = require('bluebird');
const frontmatter = require('frontmatter');
const fs = P.promisifyAll(require('fs-extra'));
const gulp = require('gulp');
const path = require('path');
const postcss = require('gulp-postcss');
const prism = require('prismjs');
const pump = P.promisify(require('pump'));
const slugify = require('slugify');
const through = require('through2').obj;
const duplexer = require('duplexer2');

const render = require('./multiplane-render');
const exampler = require('./multiplane-exampler');

const isDoc = /^(doc\n)/;

const assembleTree = function () {
	const categories = {};
	const all = {};

	const needparent = {};
	const errors = [];

	const md = MD({
		highlight: (code, lang) => {
			switch(lang) {
				case 'html':
				case 'html_example':
					lang = 'markup';
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

	return through(function (doc, _, next) {
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
				if (!categories[category]) categories[category] = [];
				categories[category].push(doc);
			});
		} else if (all[doc.parent]) {
			addChild(all[doc.parent], doc);
		} else {
			if (!needparent[doc.parent]) needparent[doc.parent] = [];
			needparent[doc.parent].push(doc);
		}

		return next();
	}, function (done) {
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
			const rendered = render(categories, docs, category);
			this.push(new File({
				path: `${category}.html`,
				contents: new Buffer(rendered)
			}));
		});

		return done();
	});
};

const extractMarkdown = require('postcss').plugin('multiplane-extract-md', (opts) => {
	const { output } = opts;

	function error(err) {
		if (output.hasErrored) return;
		output.emit('error', err);
		output.hasErrored = true;
	}

	return (css, result) => {
		// walk comments
		css.walkComments(comment => {
			if (!isDoc.test(comment.text)) return;

			const { data, content } = frontmatter(comment.text.replace(isDoc, ''));
			const doc = Object.assign({}, data, { content });

			if (doc.title && !doc.name) doc.name = slugify(doc.title);

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
		const messages = errors.map(e => `\t${e.message}`).join('\n');
		throw Object.assign(new Error(`Errors:\n${messages}`), { details: errors });
	} else if (errors.length == 1) {
		throw errors[0];
	}
}

function addChild(doc, child) {
	if (!doc.children) doc.children = [];
	doc.children.push(child);
}

function pairs(obj) {
	return Object.keys(obj).map(e => {
		return [ e, obj[e] ];
	});
}

module.exports.gulp = function (opts) {
	const input = through();
	const output = through();
	const md = assembleTree();

	pump(input, postcss([
		extractMarkdown({ output: md })
	])).then(() => md.end())

	pump(md, output);

	return duplexer({ objectMode: true }, input, output);
};

