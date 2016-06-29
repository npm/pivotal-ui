$(function(){
  $(document).on('FormInput:input', function(e){
    $('.input-bubble-test').text(e.originalEvent.detail.currentValue);
  });
});
