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
  this.currentValue = "";
};

LinkUpdater.prototype.updateValue = function(inputValue){
  var err = isInvalid(inputValue);
  if(err) {
    inputValue = this.currentValue;
    this.input.val(this.currentValue);
    // setImmediate forces input-error to be triggered on the next tick, so it
    // will follow any input
    setImmediate(function(){
      this.input.trigger({
        type: "input-error",
        message: err.message
      });
    }.bind(this));
  }

  var pathVal = inputValue;

  if(inputValue === ""){
    pathVal = this.demoValue;
  }

  this.currentValue = inputValue;
  this.pathDisplay.text(pathVal);
};


$(function(){
  var linkUpdater = $(".link-updater-container");

  $.each(linkUpdater, function(idx, el){
    new LinkUpdater(el);
  });
});

module.exports = LinkUpdater;
