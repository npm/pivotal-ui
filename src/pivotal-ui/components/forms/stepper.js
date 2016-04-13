var FormStepper = function(el, input, decrementButton, incrementButton){
  this.stepper         = $(el);
  this.input           = input || this.stepper.find("input[type=number]");
  this.decrementButton = decrementButton || this.stepper.find(".btn-decrement");
  this.incrementButton = incrementButton || this.stepper.find(".btn-increment");

  this.min = parseInt(this.input.attr("min")) || 0;
  this.max = parseInt(this.input.attr("max")) || 99999;
  this.value = parseInt(this.input.val()) || parseInt(this.min);
};

FormStepper.prototype.increment = function(){
  var val = parseInt(this.value) || this.min;
  this.set(val + 1);
};

FormStepper.prototype.decrement = function(){
  var val = parseInt(this.value) || this.min;
  this.set(val - 1);
};

FormStepper.prototype.set = function(number){
  number = parseInt(number) || this.min;

  if( number <= this.min ){
    number = this.min;
  } else if (number >= this.max ){
    number = this.max;
  }

  this.value = number;
  this.input.val(number);
  this.stepper.trigger("FormStepper:changed", [number]);
};

FormStepper.prototype.addListeners = function(){
  var self = this;

  this.incrementButton.on("click", function(){
    self.increment();
  });

  this.decrementButton.on("click", function(){
    self.decrement();
  });

  this.input.on("change", function(){
    var val = parseInt(self.input.val()) || self.min;
    self.set(val);
  });
};

$(function(){
  $.each($('.form-stepper'), function(i, el) {
    var fs = new FormStepper(el);
    fs.addListeners();
  });
});


module.exports = FormStepper;
