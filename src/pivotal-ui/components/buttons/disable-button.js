var buttons;
var handleInputChangeForDisable = function handleInputChangeForDiable(e){
  if(!buttons.length){
    return;
  }
  var input = e && e.target;

  if (input && input.name === 'orgScope') {

    for(var i = 0; i < buttons.length; i++){
      if (input.value === buttons[i].getAttribute("data-username")) {
        buttons[i].setAttribute("disabled", "disabled");
      } else {
        buttons[i].removeAttribute("disabled");
      }
    }
  }

};

document.addEventListener('DOMContentLoaded', function(){
  buttons = document.querySelectorAll("[data-button-type='disable-on-matching-username']");
  document.addEventListener('input', handleInputChangeForDisable, false);
});

