const MD = require('markdown-it');
const P = require('bluebird');
const fs = P.promisifyAll(require('fs-extra'));
const frontmatter = require('frontmatter');
const path = require('path');
const sligify = require('slugify');
const render = require('./multiplane-render');
const prism = require('prismjs');
const exampler = require('./multiplane-exampler');
const postcss = require('gulp-postcss');

const isDoc = /^(doc\n)/;

const multiplane = module.exports = require('postcss').plugin('multiplane', (opts) => {
	opts = Object(opts);
	const destination = path.resolve(process.cwd(), opts.destination || 'styleguide');
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

	return (css, result) => {
		// set current css directory or current directory
		const dir = path.resolve(path.dirname(css.source.input.file));

		const categories = {};
		const all = {};

		const needparent = {};
		const errors = [];

		// walk comments
		css.walkComments(comment => {
			if (!isDoc.test(comment.text)) return;

			const { data, content } = frontmatter(comment.text.replace(isDoc, ''));
			const doc = Object.assign({}, data);

			if (doc.title && !doc.name) doc.name = slugify(doc.title);

			if (!doc.name) {
				errors.push(new Error(`Document has no title and no name. It starts '${comment.text.slice(0, 30)}'`));
				return;
			}

			doc.__html = md.render(content);

			const name = doc.name || 'section';

			if (all[doc.name]) {
				errors.push(new Error(`Duplicate document '${doc.name}`));
				return;
			}

			if (doc.parent && doc.categories) {
				errors.push(new Error(`Document has both parent and categories: '${doc.name}'`));
				return;
			}

			if (!doc.parent && !doc.categories) {
				errors.push(new Error(`Document has no parent and no categories: '${doc.name}'`));
				return;
			}

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
		});

		const docsWithoutParents = Object.keys(needparent);
		docsWithoutParents.forEach(name => {
			errors.push(new Error(`Missing parents: ${docsWithoutParents.join(', ')}`));
		});

		reportErrors(errors);

		return P.all(pairs(categories).map(([category, docs]) => {
			const rendered = render(categories, docs, category);
			return fs.outputFileAsync(path.resolve(destination, `${category}.html`), rendered);
		}));
	};
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
	return postcss([
		multiplane(opts)
	]);
};

