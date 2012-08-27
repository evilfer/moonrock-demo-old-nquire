


var MoonrockShareFindings = {
  init: function() {
    
    var checked = $("input#edit-shareditems").attr('value').split(',');
    $("input[name='moonrock-share-findings-select']").each(function() {
      if (checked.indexOf($(this).attr('value')) >= 0) {
        $(this).attr('checked', true);
      }
    });
    
    $("input[name='moonrock-share-findings-select']").change(function() {
      if ($(this).attr('checked')) {
        $("input[value='" + $(this).attr('parent') + "']").attr('checked', true);
      }
      MoonrockShareFindings.update();
    });
  },

  update: function() {
    var checked = [];
    $("input[name='moonrock-share-findings-select']").each(function() {
      if ($(this).attr('checked')) {
        checked.push($(this).attr('value'));
      }
    });
    $("input#edit-shareditems").attr('value', checked.join(","));
  }
};


$(function() {
  MoonrockShareFindings.init();
});
