document.addEventListener('DOMContentLoaded', function(){
  var inputs = document.querySelectorAll("input[data-form-input-event=input]");
  Array.prototype.forEach.call(inputs, function(input){
    input.addEventListener('input', function(e){
      var ev = new CustomEvent('FormInput:input', {
        bubbles: true,
        cancelable: true,
        detail: {
          currentValue: e.target.value
        }
      });
      e.target.dispatchEvent(ev);
    });
  });
});
