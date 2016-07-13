var test = require('tape');
var $ = require('jquery');
var LinkUpdater = require('@npmcorp/pui-css-forms').linkUpdater;

var template = '<div class="form-group link-updater-container">' +
    '<label for="orgname">Name your Organization</label>' +
    '<div class="link-updater input-wrapper">' +
      '<input name="orgname" id="orgname" autocomplete="off" class="form-control" placeholder="your-org-name" >' +
      '<p class="mtl">https://www.npmjs.com/org/<strong>your-org-name</strong></p>' +
    '</div>' +
  '</div>';

test('Creates link-updater component', function(t) {
  var el = $(template);

  var lu = new LinkUpdater(el);

  t.equal($(lu.updater).attr("class"), "link-updater input-wrapper", "initializes correct item");
  t.equal($(lu.input).attr("id"), "orgname", "gets correct input");
  t.equal($(lu.pathDisplay).text(), "your-org-name", "finds element to update link fragment in");
  t.equal(lu.demoValue, 'your-org-name', "demoValue attribute is correctly set");
  t.end();
});

test('input is reflected into the link', function(t) {
  var el = $(template);

  var lu = new LinkUpdater(el);

  lu.updateValue("a-name");
  t.equal(lu.pathDisplay.text(), "a-name", "valid value should be reflected");

  lu.updateValue(".a-name");
  t.equal(lu.pathDisplay.text(), "a-name", "valid value should still be reflected");

  lu.updateValue("");
  t.equal(lu.pathDisplay.text(), lu.demoValue, "empty string value changes link to set demoValue");

  t.end();
});
