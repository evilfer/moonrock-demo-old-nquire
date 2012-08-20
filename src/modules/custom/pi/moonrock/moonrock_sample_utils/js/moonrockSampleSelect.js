
var SampleSelectionHelper = {
  selectedSample: '',
  selectedSnapshot: '',
  autoselect : true,
  isSelecting: false,
  
  init: function() {

    this.findSamples();
    
    var defaultValue = $('input#moonrock_sample_input').attr('value');
    if (defaultValue) {
      if ($('input[name="moonrock_select_sample"][value="' + defaultValue + '"]').length == 0) {
        if (typeof(MoonrockSampleSearch) != "undefined") {
          MoonrockSampleSearch.retrieveDefaultValue(defaultValue);
        }
      } else {
        this.setDefaultValue(defaultValue);
      }
    }
  },
  
  findSamples: function() {
    $('input[name^="moonrock_select_"]').unbind("change");
    $('input[name^="moonrock_select_"]').change(function() {
      SampleSelectionHelper.autoselect = false;
      SampleSelectionHelper.select(this.value);
    });
    
    /*$('img.moonrocksampleimage').unbind("click");
    $('img.moonrocksampleimage').click(function() {
      var value = $(this).parents(".moonrocksample").attr("sample");
      if (SampleSelectionHelper.autoselect) {
        SampleSelectionHelper.select(value);
      }
    });*/
    
    this._notifySelection(this.selectedSample);
    this._notifySelection(this.selectedSnapshot);
    this._updateGui();
  },
  
  _notifySelection : function(value) {
    if (typeof(MoonrockSampleSearch) != 'undefined' && value.length > 0) {
      MoonrockSampleSearch.sampleSelected(value);
    }
  },
  
  _updateGui : function() {
    $(".moonrocksample").removeClass("moonrocksampleselected");
    $(".moonrocksample[sample='" + 
      this.selectedSample + "'], .moonrocksample[sample='" + 
      this.selectedSnapshot + "']").addClass("moonrocksampleselected");

    $('input[name^="moonrock_select_sample"]').each(function() {
      this.checked = this.value == SampleSelectionHelper.selectedSample;
    });
    $('input[name="moonrock_select_snapshot"]').each(function() {
      this.checked = this.value == SampleSelectionHelper.selectedSnapshot;
    });
  },
  
  _selectSample: function(value) {
    this.selectedSample = value;
    $('[measure_content_type="moonrock_sample"]').attr('value', value);
    this._updateGui();
    this._notifySelection(value);
    
    if (this.selectedSnapshot.length > 0) {
      var snapshotSample = this._sampleForSnapshot(this.selectedSnapshot);
      if (snapshotSample != this.selectedSample) {
        this._selectSnapshot('');
      }
    }
  },
  
  _selectSnapshot: function(value) {
    this.selectedSnapshot = value;
    $('[measure_content_type="moonrock_snapshot"]').attr('value', value);
    this._updateGui();
    this._notifySelection(value);
    
    if (this.selectedSnapshot.length > 0) {
      var snapshotSample = this._sampleForSnapshot(this.selectedSnapshot);
      if (snapshotSample != this.selectedSample) {
        this._selectSample(snapshotSample);
      }
    }
  },
  select: function(value) {
    if ($('input[name^="moonrock_select_sample"][value="' + value + '"]').length > 0) {
      this._selectSample(value);
    } else if ($('input[name="moonrock_select_snapshot"][value="' + value + '"]').length > 0) {
      this._selectSnapshot(value);
    }
  },
  _sampleForSnapshot:function(value) {
    return $('.moonrocksamplesnapshot[sample="' + value + '"]')
    .parent()
    .find('.moonrocksampleresult')
    .attr('sample');
  },

  setDefaultValue : function(value) {
    this.select(value);
  },
  clearSelection: function() {
    this._selectSample('');
    this._selectSnapshot('');
  },
  unselectIfSelected: function(value) {
    if (value == this.selectedSample) {
      this._selectSample('');
    } else if (value == this.selectedSnapshot) {
      this._selectSnapshot('');
    }
  }
};
  
