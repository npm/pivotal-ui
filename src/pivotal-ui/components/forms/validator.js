var $ = require('jquery');

var addError = function addError(input, err) {
  var msg = err || input.validationMessage;
  $(input).closest(".form-group").addClass('has-error');
  $(input).closest(".input-wrapper").append("<span class='help-block has-error'>" + msg + "</span>");
};

var removeError = function removeError(input) {
  $(input).closest(".form-group").removeClass('has-error');
  $(input).closest(".input-wrapper").find(".has-error").remove();
};


var handleSubmit = function handleSubmit(e){
  var self = this;
  if (!this.form[0].checkValidity()) {
    e.preventDefault();
    $.each(this.inputs, function(idx, input){
      self.reflectValidity(input);
    });
  }
};

var handleBlur = function handleBlur(e) {
  this.reflectValidity(e.target);
};

var handleInput = function handleInput(e) {
  var input = e.target;
  var $input = $(input);
  var err;

  var isNoMatch = $input.is("[data-validate-nomatch]");

  if(isNoMatch) {
    var label = $input.closest(".form-group").find("label");
    var labelText = label.attr("data-validate-nomatch-label") || label.text();
    var matchName = $input.attr("data-validate-nomatch-name") || input.name;
    err = input.value === $input.attr("data-validate-nomatch") ? new Error(labelText + " cannot match existing " + matchName) : err;
  }

  if(err) {
    input.setCustomValidity(err.message);
  } else {
    input.setCustomValidity('');
  }

  this.reflectValidity(input);
};

var handleInputError = function handleInputError(e) {
  var input = e.target;
  var message = e.message;

  this.reflectValidity(input, message);
};

var ValidatedForm = function ValidatedForm(el) {
  this.form = $(el);
  this.inputs = this.form.find("input");
  this.submitButton = this.form.find("[type='submit']");

  this.form.attr("novalidate", "");

  if(!this.form[0].checkValidity()){
    this.submitButton.attr("disabled", "");
  }
};

ValidatedForm.prototype.addListeners = function addListners() {
  this.form.on("submit", handleSubmit.bind(this));
  this.form.on("input", handleInput.bind(this));
  this.form.on("change", "input[type='checkbox'], input[type='radio']", handleInput.bind(this));
  this.form.on("focusout", handleBlur.bind(this));
  this.form.on("input-error", handleInputError.bind(this));
};

/*
 * reflectValidity takes the internal state of the inputs and form and reflects
 * them to the user in visible ways.
 *
 * There are two kinds of things being reflected: ongoing validity states
 * (level triggered, but captured here on the leading edge) and transient
 * errors (edge triggered) that we notify the user of when they happen, but
 * clear them upon the next event.
 *
 * The difference between the two? the message parameter. If it's present,
 * we're reflecting transient state; if absent, we're reflecting ongoing
 * validity
 *
 */
ValidatedForm.prototype.reflectValidity = function reflectValidity(input, message){
  if($(input).is("[data-validate-no-error]")) {
    //no-op
  } else if(!input.checkValidity() || message) {
    removeError(input);
    addError(input, message);
  } else {
    removeError(input);
  }

  if(this.form[0].checkValidity()){
    this.submitButton.removeAttr("disabled");
  } else {
    this.submitButton.attr("disabled", "");
  }
};

$(function(){
  var forms = $("form[data-validate]");

  $.each(forms, function(idx, form){
    var vf = new ValidatedForm(form);
    vf.addListeners();
  });
});

module.exports = ValidatedForm;

