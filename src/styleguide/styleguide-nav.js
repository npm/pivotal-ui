const React = global.React || require('react');
const SimpleTabs = global.SimpleTabs || require('@npmcorp/pui-react-tabs').SimpleTabs;
const Tab = global.Tab || require('@npmcorp/pui-react-tabs').Tab;
const Collapse = global.Collapse || require('@npmcorp/pui-react-collapse').Collapse;
const lodash = require('lodash');

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

      const components = lodash.reduce(lodash.values(componentTypes), (e, a) => Object.assign({}, e, a), {});

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
