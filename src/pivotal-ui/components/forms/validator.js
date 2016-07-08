var $ = require('jquery');
var isInvalidName = require('npm-user-validate').username;

$(function(){
  var forms = $("form[data-validate]");

  $.each(forms, function(idx, el){
    $(el).attr("novalidate", "");
    $(el).on("submit", handleSubmit);

    $.each(el, function(idx, input){
      $(input).on("blur", handleBlur);
      $(input).on("input", handleInput);
    });
  });
});

var addError = function addError(input, err) {
  var msg = err || input.validationMessage;
  $(input).closest(".form-group").addClass('has-error');
  $(input).closest(".input-wrapper").append("<span class='help-block has-error'>" + msg + "</span>");
};

var removeError = function removeError(input) {
  $(input).closest(".form-group").removeClass('has-error');
  $(input).closest(".input-wrapper").find(".has-error").remove();
};

var reflectValidity = function(input){
  if(!input.checkValidity()) {
    removeError(input);
    addError(input);
  } else {
    removeError(input);
  }
};

var handleSubmit = function handleSubmit(e){
  var form = e.target;
  if (!form.checkValidity()) {
    e.preventDefault();
    var inputs = $(form).find("input");
    $.each(inputs, function(idx, input){
      reflectValidity(input);
    });
  }
};

var handleBlur = function handleBlur(e) {
  reflectValidity(e.target);
};

var handleInput = function handleInput(e) {
  var input = e.target;
  var isLinkUpdater = $(input).closest(".form-group").hasClass("link-updater-container");
  if(isLinkUpdater) {
    var err = isInvalidName(input.value);
    if(err) {
      input.setCustomValidity(err.message);
    } else {
      input.setCustomValidity('');
    }
  }
  reflectValidity(input);
};
