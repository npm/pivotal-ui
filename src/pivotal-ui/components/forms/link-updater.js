var $ = require('jquery');
var isInvalid = require('npm-user-validate').username;

var errorClass = "has-error";

var LinkUpdater = function(el){
  this.el = $(el);
  this.updater = this.el.find(".link-updater");
  this.input = this.el.find("input");
  this.pathDisplay = this.el.find("p strong");
  this.demoValue = this.input.attr("placeholder") || "username";
  this.currentValue = "";
};

LinkUpdater.prototype.updateValue = function(inputValue){
  var err = isInvalid(inputValue);
  if(err) {
    inputValue = this.currentValue;
    this.input.val(this.currentValue);
    this.showError(err.message);
  } else {
    this.hideError();
  }

  var pathVal = inputValue;

  if(inputValue === ""){
    pathVal = this.demoValue;
  }

  this.currentValue = inputValue;
  this.pathDisplay.text(pathVal);
};

LinkUpdater.prototype.showError = function(msg){
  var err = this.updater.find("." + errorClass);

  if(!err.length) {
    err = $("<span class='help-block " + errorClass + "'>" + msg + "</span>");

    this.el.addClass(errorClass);
    this.updater.append(err);
  } else {
    err.text(msg);
  }

};

LinkUpdater.prototype.hideError = function(){
  this.el.removeClass(errorClass);
  this.updater.find("." + errorClass).remove();
};

$(function(){
  var linkUpdater = $(".link-updater-container");

  $.each(linkUpdater, function(idx, el){
    var lu = new LinkUpdater(el);

    lu.input.on("input", function(e){
      lu.updateValue(e.target.value);
    });

  });
});

module.exports = LinkUpdater;
