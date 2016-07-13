var test = require('tape');
var $ = require('jquery');
var DropDownMenu = require('../src/pivotal-ui/components/drop-down-menu/drop-down-menu');

test('Creates drop-down-menu module with proper pieces', function(t) {
  var id = 'test1';
  var el = $("<div class='drop-down-menu' id='" + id + "' />");
  var toggle = $("<a href='#" + id + "' />");
  var overlay = $("<div class='drop-down-menu-overlay' data-drop-down-menu='" + id + "'/>");

  var ddm = new DropDownMenu(el, toggle, overlay);

  t.equal(ddm.id, id, "DropDownMenu id should match expected id");
  t.equal(ddm.menuToggle.attr("href"), '#' + id, "DropDownMenu toggle href should match id");
  t.equal(ddm.menuOverlay.attr("data-drop-down-menu"), id, "DropDownMenu overlay should line up with drop down menu id");
  t.end();
});