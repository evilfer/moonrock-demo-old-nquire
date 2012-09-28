

var MoonrockDataInput = {
  dataModified: false,
  
  init: function() {
    console.log('datainput');

    var self = this;
    
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample) {
      self.setSample(sample);
    });

    if ($('input[measure_content_type="moonrock_sample"]').attr('value')) {
      MoonrockVmViewManager.openSample($('input[measure_content_type="moonrock_sample"]').attr('value'));
      this.setModeEdit(true);
    } else {
      this.setModeEdit(false);
    }
  },
  
  setModeEdit: function(editing) {
    if (editing) {
      $('#moonrock-data-input-button-save').hide();
      $('#moonrock-data-input-button-update, #moonrock-data-input-button-savenew, #moonrock-data-input-button-delete').show();
    } else {
      $('#moonrock-data-input-button-update, #moonrock-data-input-button-savenew, #moonrock-data-input-button-delete').hide();
      $('#moonrock-data-input-button-save').show();
      this.clearForm();
    }
  },
  
  setSample: function(sample, sampleChanged) {
    if (sampleChanged) {
      this.setModeEdit(false);
    }
    this.updateSampleData(sample);
  },
  
  setItem: function(item) {
    
  },
  
  clearForm: function() {
    this.dataModified = false;
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('clearSelection');
    }
    
    $('#edit-data-nid').attr('value', '');
    
    $('input[type="text"], textarea').val('');
    $('select').val(null);
  },
  
  updateSampleData: function(sample) {
    $('input[measure_content_type="moonrock_sample"]').attr('value', sample.id);
    $('#moonrock-measure-fixedvalue-sample').html(sample.title);
  },
  

  
  submitData: function() {
    var self = this;
    
    MoonrockDataInputImage.getVMData(200, function(snapshot) {
      $('input[measure_content_type="moonrock_snapshot_image"]').attr('value', snapshot.image);
      $('input[measure_content_type="moonrock_snapshot_parameters"]').attr('value', snapshot.vm_parameters);
      $('input[measure_content_type="moonrock_snapshot_notes"]').attr('value', $('form#node-form').find('.form-textarea').val());
      
      $.ajax({
        url: '?q=moonrock_data_input/' + MoonrockVmViewManager.getActivityId() + '/submit',
        type: "POST",
        dataType: 'json',
        data: $('form').serialize(),
        success: function(data) {
          if (data.status) {
            self.setModeEdit(false);
            MoonrockDataInputDataBrowser.refresh($('input[measure_content_type="moonrock_sample"]').attr('value'));
          }
        },
        error: function() {
        }
      });
    });
  },
    
  
  saveData: function() {
    this.submitData();
  },
  updateData: function() {
    this.submitData();
  },
  saveNewData: function() {
    $('#edit-data-nid').attr('value', '');
    this.submitData();
  },
  deleteData: function() {
    
  }  
};

$(function() {
  MoonrockDataInput.init();
});

