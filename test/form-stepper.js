var test = require('tape');
var $ = require('jquery');
var FormStepper = require('../src/pivotal-ui/components/forms/stepper');

test('Creates stepper module with proper pieces', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' />");
  var input = $("<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />");
  var button1 = $("<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>");
  var button2 = $("<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el, input, button1, button2);

  t.equal($(fs.stepper).attr("class"), "form-stepper", "Form Stepper initializes correct item");
  t.equal($(fs.input).attr("id"), "stepper-input", "Form Stepper sets correct input");
  t.equal($(fs.decrementButton).attr("id"), "left-button", "Form Stepper sets correct decrement button");
  t.equal($(fs.incrementButton).attr("id"), "right-button", "Form Stepper sets correct increment button");
  t.equal(fs.min, min, "Form stepper min should match input min");
  t.equal(fs.max, max, "Form stepper max should match input max");
  t.equal(fs.value, value, "Form stepper value should match input value");
  t.end();
});

test('Creates stepper module with proper pieces when nothing is passed in', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);

  t.equal($(fs.stepper).attr("class"), "form-stepper", "Form Stepper initializes correct item");
  t.equal($(fs.input).attr("id"), "stepper-input", "Form Stepper sets correct input");
  t.equal($(fs.decrementButton).attr("id"), "left-button", "Form Stepper sets correct decrement button");
  t.equal($(fs.incrementButton).attr("id"), "right-button", "Form Stepper sets correct increment button");
  t.equal(fs.min, min, "Form stepper min should match input min");
  t.equal(fs.max, max, "Form stepper max should match input max");
  t.equal(fs.value, value, "Form stepper value should match input value");
  t.end();
});

test('Creates stepper module with proper defaults when input is lacking', function(t) {
  var selector = 'form-stepper';
  var defaultMin = 0;
  var defaultValue = defaultMin;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' type='number' />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);

  t.equal(fs.min, defaultMin, "Form stepper min should match input min default");
  t.equal(fs.value, defaultValue, "Form stepper value should match input value default");
  t.end();
});

test('#set changes the value to whichever value it is set to', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.set(2);
  t.equal(fs.value, 2, 'Set should set value for form stepper to value passed in');
  t.equal(parseInt(fs.input.val()), 2, 'Set should set value for input to value passed in');
  t.end();
});

test('#set: if value is set to less than min, the value is corrected to min', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.set(-2);
  t.equal(fs.value, min, 'Set should set value to min');
  t.equal(parseInt(fs.input.val()), min, 'Set should set value for input to min');
  t.end();
});

test('#set: if value is set to higher than max, the value is corrected to max', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.set(400);
  t.equal(fs.value, max, 'Set should set value for form stepper to max');
  t.equal(parseInt(fs.input.val()), max, 'Set should set value for input to max');
  t.end();
});

test('#set: if value is set to gibberish, the value is corrected to min', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.set('aoiegjarepogaij');
  t.equal(fs.value, min, 'Set should set value for form stepper to min');
  t.equal(parseInt(fs.input.val()), min, 'Set should set value for input to min');
  t.end();
});

test('#increment: when increment is called, the value is increased by 1', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.increment();
  t.equal(fs.value, value + 1, 'increment should increase the set value by 1');
  t.equal(parseInt(fs.input.val()), value + 1, 'increment should increase value for input by 1');
  t.end();
});

test('#decrement: when increment is called, the value is decreased by 1', function(t) {
  var selector = 'form-stepper';
  var min = 1;
  var max = 10;
  var value = 5;
  var el = $("<div class='" + selector + "' >" +
    "<button id='left-button' type='button' class='btn btn-default btn-decrement' title='decrement value'><span class='a11y-only'>decrement value</span>&minus;</button>" +
    "<input id='stepper-input' class='form-control' min='" + min + "' max='" + max + "' step='1' name='subscribers' required type='number' value=" + value + " />" +
    "<button id='right-button' type='button' class='btn btn-default btn-increment' title='increment value'><span class='a11y-only'>increment value</span>+</button>");

  var fs = new FormStepper(el);
  fs.decrement();
  t.equal(fs.value, value - 1, 'decrement should decrease the set value by 1');
  t.equal(parseInt(fs.input.val()), value - 1, 'decrement should decrease value for input by 1');
  t.end();
});