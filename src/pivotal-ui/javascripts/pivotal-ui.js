global.$ = global.jQuery = require('jquery');
global._ = require('lodash');
require('bootstrap');

require('pui-prismjs');

require('./scale')();
require('@npmcorp/pui-react-back-to-top/jquery-plugin');
require('@npmcorp/pui-css-drop-down-menu');
require('../components/forms');
require('../components/svgeople');
require('../components/dropdowns');
