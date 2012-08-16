
var SampleSelectionHelper = {
  selection: null,
  autoselect : true,
  isSelecting: false,
  
  init: function() {

    this.findSamples();
    
    var defaultValue = $('input#moonrock_sample_input').attr('value');
    if (defaultValue) {
      if ($('input[name="moonrock_sample_selection"][value="' + defaultValue + '"]').length == 0) {
        if (typeof(MoonrockSampleSearch) != "undefined") {
          MoonrockSampleSearch.retrieveDefaultValue(defaultValue);
        }
      } else {
        this.setDefaultValue(defaultValue);
      }
    }
  },
  
  findSamples: function() {
    $('input[name="moonrock_sample_selection"]').change(function() {
      SampleSelectionHelper.selectSample(this.value);
    });
    
    $('img[name="moonrock_sample_selection"]').click(function() {
      var value = $(this).attr('sample');
      SampleSelectionHelper.clickSample(value);
    });
  },
  
  updateClasses: function() {
    $(".moonrocksample").removeClass("moonrocksampleselected");
    $(".moonrocksample[sample='" + this.selection + "']").addClass("moonrocksampleselected");
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
    if (typeof(MoonrockSampleSearch) != "undefined") {
      MoonrockSampleSearch.sampleSelected(value);
    }
  },
  setDefaultValue : function(value) {
    this.clickSample(value);
    this.autoselect = false;
  },
  clearSelection: function() {
    this.setSelection("");
    $('input[name="moonrock_sample_selection"]').each(function() {
      this.checked = false;
    });
  },
  unselectIfSelected: function(value) {
    if (this.selection == value) {
      this.clearSelection();
    }
  }
};
  
