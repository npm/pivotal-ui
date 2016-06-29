var button;
var handleInputChangeForDisable = function handleInputChangeForDiable(e){
  if(e.detail.currentValue === button.getAttribute('data-username')){
    button.setAttribute("disabled", "disabled");
  } else {
    button.removeAttribute("disabled");
  }
};

document.addEventListener('DOMContentLoaded', function(){
  button = document.querySelector("[data-button-listening='FormInput:input'][data-button-type='disable']");
});

document.addEventListener('FormInput:input', handleInputChangeForDisable, false);
