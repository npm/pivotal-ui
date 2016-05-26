var $ = require('jquery');
var isInvalid = require('npm-user-validate').username;

var LinkUpdater = function(el){
  this.el = $(el);
  this.input = this.el.find("input");
  this.pathDisplay = this.el.find("p strong");
  this.currentValue = "";
};

LinkUpdater.prototype.updateValue = function(inputValue){
  var pathVal = inputValue;
  if(inputValue === ""){
    pathVal = "username";
  }
  this.currentValue = inputValue;
  this.pathDisplay.text(pathVal);
};

LinkUpdater.prototype.showError = function(msg){
  var err = this.el.find(".error");

  if(!err.length) {
    err = $("<span />")
    .addClass("error")
    .text(msg);

    this.el.append(err);
  } else {
    err.text(msg);
  }

};

LinkUpdater.prototype.hideError = function(){
  this.el.find(".error").remove();
};

$(function(){
  var linkUpdater = $(".link-updater");

  $.each(linkUpdater, function(idx, el){
    var lu = new LinkUpdater(el);

    lu.input.on("input", function(e){
      var err = isInvalid(e.target.value);
      if(err) {
        e.target.value = lu.currentValue;
        lu.showError(err.message);
      } else {
        lu.hideError();
        lu.updateValue(e.target.value);
      }
    });

  });
});

module.exports = LinkUpdater;
