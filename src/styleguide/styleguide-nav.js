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
    const {navTree, defaultLanguage, defaultComponentType} = this.props;

    const languageNames = ['CSS', 'React'];
    const tabs = languageNames.map((language) => {
      const componentTypes = navTree[language];

      const components = reduce(values(componentTypes), (e, a) => Object.assign({}, e, a), {});

      return (
        <Tab eventKey={language.toLowerCase()} key={`nav-tab-${language}`} title={language} className="pvn phn">
          <ComponentList components={components} />
        </Tab>
      );

    });

    return (
      <SimpleTabs defaultActiveKey={defaultLanguage.toLowerCase()}>
        {tabs}
      </SimpleTabs>
    );
  }
}

StyleguideNav.propTypes = {
  defaultLanguage: React.PropTypes.string.isRequired,
  defaultComponentType: React.PropTypes.string.isRequired,
  navTree: React.PropTypes.object.isRequired
}
