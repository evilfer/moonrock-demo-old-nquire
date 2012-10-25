

var PiKeyAnswers = {
  init: function() {
    $('select[name="key_question_id"]').change(function() {
      PiKeyAnswers.displayCharts();
    });
    
    this.displayCharts();
  },
  
  displayCharts: function() {
    $('img[question]').hide();
    $('img[question="' + $('select[name="key_question_id"]').val() + '"]').show();
    return;
  }
};

$(function() {
  MoonrockModules.register('PiKeyAnswers', PiKeyAnswers);
});



