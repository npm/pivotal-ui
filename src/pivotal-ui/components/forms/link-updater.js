var $ = require('jquery');
var isInvalid = require('npm-user-validate').username;

var LinkUpdater = function(el){
  this.el = $(el);
  this.updater = this.el.find(".link-updater");
  this.input = this.el.find("input");

  this.input.on("input", function(e){
    this.updateValue(e.target.value);
  }.bind(this));

  this.pathDisplay = this.el.find("p strong");
  this.demoValue = this.input.attr("placeholder") || "username";
};

LinkUpdater.prototype.updateValue = function(inputValue){
  if(inputValue === "") {
    this.pathDisplay.text(this.demoValue);
  } else if (!this.input[0].checkValidity() || isInvalid(inputValue)){
    //noop
  } else {
    this.pathDisplay.text(inputValue);
  }
};

$(function(){
  var linkUpdater = $(".link-updater-container");

  $.each(linkUpdater, function(idx, el){
    new LinkUpdater(el);
  });
});

module.exports = LinkUpdater;
