
var SampleSelectionHelper = {
  selection: null,
  autoselect : true,
  containers : {},
  init: function() {
    this.findSamples();
    $('input[name="moonrock_sample_selection"]').change(function() {
      SampleSelectionHelper.selectSample(this.value);
    });
    
    $('img[name="moonrock_sample_selection"]').click(function() {
      var value = $(this).attr('sample');
      SampleSelectionHelper.clickSample(value);
    });
    
    var defaultValue = $('input#moonrock_sample_input').attr('value');
    if (defaultValue) {
      this.setDefaultValue(defaultValue);
    }
  },
  
  findSamples: function() {
    this.containers = {};
    $('input[name="moonrock_sample_selection"]').each(function() {
      var value = $(this).attr("value");
      var container = this.parentNode.parentNode.parentNode;
      SampleSelectionHelper.containers[value] = container;
    });
  },
  
  updateClasses: function() {
    for (var key in this.containers) {
      if (key == this.selection) {
        $(this.containers[key]).addClass(
          "moonrocksampleselected");
      } else {
        $(this.containers[key]).removeClass(
          "moonrocksampleselected");
      }
    }
  },
  clickSample : function(value) {
    if (this.autoselect) {
      this.setSelection(value);
      $('input[name="moonrock_sample_selection"][value="' + value + '"]').each(function() {
        this.checked = true;
      });
    }
  },
  selectSample : function(value) {
    this.autoselect = false;
    this.setSelection(value);
  },
  setSelection : function(value) {
    this.selection = value;
    this.updateClasses();
    $('input#moonrock_sample_input').attr('value', value);
  },
  setDefaultValue : function(value) {
    this.clickSample(value);
    this.autoselect = false;
  }
};
  
$(function() {  
  SampleSelectionHelper.init();
});
