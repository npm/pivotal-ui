const React = require('react');
const { Pane } = require('../src/pivotal-ui-react/panes/panes');
const { Panel } = require('../src/pivotal-ui-react/panels/panels');
const { Row, Col } = require('../src/pivotal-ui-react/grids/grids');
const { StyleguideNav } = require('../src/styleguide/styleguide-nav');
const _ = require('lodash');

class Styleguide extends React.Component {
    render() {
        const docs = this.props.docs;
        const category = this.props.category;
        const categories = this.props.categories;
        return <Layout>
            <Row>
                <Col md={4}>
                    <StyleguideNav navTree={categorylistToOldNav(categories)} defaultLanguage={"CSS"} defaultComponentType={"CSS"} />
                </Col>
                <Col md={20}>
                    <main className="ptl pbxxl">
                        {docs.map((doc, i) => <Doc key={i} doc={doc}/>)}
                    </main>
                </Col>
            </Row>
        </Layout>;
    }
}

class Doc extends React.Component {
    render() {
        const doc = this.props.doc;
        const depth = this.props.depth || 0;
        const title = (
            depth == 0 ? (<h1>{doc.title}</h1>) :
            depth == 1 ? (<h2>{doc.title}</h2>) :
            depth == 2 ? (<h3>{doc.title}</h3>) :
                         (<h4>{doc.title}</h4>)
        );
        return <section className="styleguide">
            <a id={doc.name}/>
            {title}
            {doc.children ? <ul className="section-nav">{doc.children.map((e, i) => <li key={i}><a href={`#${e.name}`}>{e.title}</a> </li>)}</ul>  : null}
            <section dangerouslySetInnerHTML={doc}/>
            {doc.children ? doc.children.map((e, i) => <Doc doc={e} key={i} depth={depth + 1}/>) : null}
        </section>;
    }
}

class Layout extends React.Component {
    render() {
        return <html>
            <head>
                <link rel="stylesheet" href="pivotal-ui.css"/>
                <link rel="stylesheet" href="prismjs/prism.css"/>
                <link rel="stylesheet" href="prismjs/prism-okaida.css"/>
                <link rel="stylesheet" href="styleguide.css"/>
            </head>
            <body>
                { this.props.children }
                <script src="pivotal-ui.js"></script>
            </body>
        </html>;
    }
}

module.exports = function render(categories, docs, category) {
    return React.renderToStaticMarkup(<Styleguide categories={categories} docs={docs} category={category} />)
}

function categorylistToOldNav(categories) {
    const out = {};
    Object.keys(categories).sort().forEach(category => {
        if (/_all/.test(category)) return;
        _.set(out, category.split('_').map(toName), `${category}.html`);
    });
    return out;

    function toName(e) {
        if (e == 'css') {
            return 'CSS';
        } else {
            return e[0].toUpperCase() + e.slice(1)
        }
    }
}
