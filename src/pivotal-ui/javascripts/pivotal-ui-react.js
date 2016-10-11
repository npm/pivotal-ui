global.$ = global.jQuery = require('jquery');
require('../../../node_modules/bootstrap/js/tooltip');

require('pui-prismjs');

require('./scale')();
require('@npmcorp/pui-react-back-to-top/jquery-plugin');

global.React = require('react/addons');

import UI from './components.js';

for (var k in UI) {
    global[k] = UI[k];
};
