const React = global.React || require('react');
const { Tab, SimpleTabs } = require('../pivotal-ui-react/tabs/tabs');
const { Collapse } = require('../pivotal-ui-react/collapse/collapse');
const reduce = require('lodash.reduce');
const values = require('lodash.values');

class ComponentList extends React.Component {
  render() {
    const {components} = this.props;

    let componentNames = Object.keys(components).sort();

    const componentItems = componentNames.map((component) => {
      return (
        <li key={`ok-react-${component}`}>
          <a href={components[component]}>{component}</a>
        </li>
      );
    });

    return (
      <ul className="list-unstyled mlxl">
        {componentItems}
      </ul>
    );
  }
}

export class StyleguideNav extends React.Component {
  render() {
    const {navTree, lang} = this.props;

    const navByLanguage = {
      CSS: reduce(values(navTree.CSS), (e, a) => Object.assign({}, e, a), {}),
      React: reduce(values(navTree.React), (e, a) => Object.assign({}, e, a), {})
    };

    const cssActive = lang == 'css' ? 'active in' : '';
    const reactActive = lang == 'react' ? 'active in' : '';
    return (
      <div className="tab-simple">
        <ul className="nav nav-tabs">
          <li className={cssActive}><a data-toggle="tab" href="#lang-css">CSS</a></li>
          <li className={reactActive}><a data-toggle="tab" href="#lang-react">React</a></li>
        </ul>
        <div className="tab-content">
          <div className={`tab-pane fade in ${cssActive} pan`} id="lang-css">
            <ul className="list-unstyled mlxl">
              {lodash.map(navByLanguage.CSS, (v, k) => <li key={`component-CSS-${k}`}><a href={v}>{k}</a></li>)}
            </ul>
          </div>
          <div className={`tab-pane fade ${reactActive} pan`} id="lang-react">
            <ul className="list-unstyled mlxl">
              {lodash.map(navByLanguage.React, (v, k) => <li key={`component-React-${k}`}><a href={v}>{k}</a></li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
