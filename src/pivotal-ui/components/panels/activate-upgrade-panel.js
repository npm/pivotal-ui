var upgradePanel;
var handleInputChangeForUpgrade = function handleInputChangeForUpgrade(e){
  if(e.detail.currentValue === upgradePanel.getAttribute('data-username')){
    //jQuery because using bootstrap collapse functionality
    $(upgradePanel).collapse('show');
    document.removeEventListener('FormInput:input', handleInputChangeForUpgrade);
  }
};

document.addEventListener('DOMContentLoaded', function(){
  upgradePanel = document.querySelector("[data-panel-listening='FormInput:input'][data-panel-type='upgrade']");
});

document.addEventListener('FormInput:input', handleInputChangeForUpgrade, false);
