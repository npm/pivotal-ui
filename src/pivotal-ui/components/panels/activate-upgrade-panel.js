var upgradePanel;

var handleInputChangeForUpgrade = function handleInputChangeForUpgrade(e){
  if(!upgradePanel) {
    return;
  }
  var input = e && e.target;

  if (input && input.name === 'orgScope') {
    if (input.value === upgradePanel.getAttribute("data-username")) {
      $(upgradePanel).collapse('show');
      document.removeEventListener('input', handleInputChangeForUpgrade);
    }
  }
};

document.addEventListener('DOMContentLoaded', function(){
  upgradePanel = document.querySelector("[data-panel-type='upgrade-on-matching-username']");
  document.addEventListener('input', handleInputChangeForUpgrade, false);
});

