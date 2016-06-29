var button;
var handleInputChangeForDisable = function handleInputChangeForDiable(e){
  if(!button){
    return;
  }
  var input = e && e.target;

  if (input && input.name === 'orgScope') {
    if (input.value === button.getAttribute("data-username")) {
      button.setAttribute("disabled", "disabled");
    } else {
      button.removeAttribute("disabled");
    }
  }

};

document.addEventListener('DOMContentLoaded', function(){
  button = document.querySelector("[data-button-type='disable-on-matching-username']");
  document.addEventListener('input', handleInputChangeForDisable, false);
});

