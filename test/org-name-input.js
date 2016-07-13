var test = require('tape');
var $ = require('jquery');
var LinkUpdater = require('../src/pivotal-ui/components/forms').linkUpdater;

var template = '<div class="form-group link-updater-container">' +
    '<label for="orgname">Name your Organization</label>' +
    '<div class="link-updater">' +
      '<input name="orgname" id="orgname" autocomplete="off" class="form-control" placeholder="your-org-name">' +
      '<p class="mtl">https://www.npmjs.com/org/<strong>your-org-name</strong></p>' +
    '</div>' +
  '</div>';

test('Creates link-updater component', function(t) {
  var selector = 'link-updater';
  var el = $(template);

  var lu = new LinkUpdater(el);

  t.equal($(lu.updater).attr("class"), "link-updater", "initializes correct item");
  t.equal($(lu.input).attr("id"), "orgname", "gets correct input");
  t.equal($(lu.pathDisplay).text(), "your-org-name", "finds element to update link fragment in");
  t.equal(lu.currentValue, "", "Initial value should be empty");
  t.end();
});

test('input is reflected into the link', function(t) {
  var selector = 'link-updater';
  var el = $(template);

  var lu = new LinkUpdater(el);

  lu.updateValue("a-name");
  t.equal(lu.currentValue, "a-name", "valid value should be reflected");

  lu.updateValue(".a-name");
  t.equal(lu.currentValue, "a-name", "valid value should still be reflected");
  t.ok(lu.el.hasClass("has-error"), "error state is set");

  lu.updateValue("a-name");
  t.equal(lu.currentValue, "a-name", "valid value should be still reflected");
  t.notOk(lu.el.hasClass("has-error"), "error state is not set");

  t.end();
});
