

var MoonrockDataInput = {
  dataModified: false,
  
  init: function() {
    console.log('datainput');

    var self = this;
    
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample, sampleChanged) {
      self.setSample(sample, sampleChanged);
    });
    
    var data_nid = $('input[name="data_nid"]').attr('value');
    if (data_nid) {
      MoonrockVmViewManager.openSample($('input[measure_content_type="moonrock_sample"]').attr('value'));
      MoonrockDataInputDataBrowser.select(data_nid);
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
    }
  },
  
  setSample: function(sample, sampleChanged) {
    if (sampleChanged) {
      this.clearForm();
      this.setModeEdit(false);
    }
    this.updateSampleData(sample);
  },
  
  setItem: function(item) {
    this.clearForm();
    this.setModeEdit(true);
    MoonrockDataInputDataBrowser.select(item.id);
    
    $('input[name="data_nid"]').val(item.id);
    
    
    for (var measure_nid in item.data.values) {
      var content = item.data.measures_content[measure_nid];
      switch (content) {
        case 'moonrock_color':
          if (item.data.values[measure_nid]) {
            $('body').rockColorPicker('select', item.data.values[measure_nid]);
          } else {
            $('body').rockColorPicker('clearSelection'); 
          }
          break;
        case 'moonrock_snapshot':
          /* load params */
          $('input[measure_content_type="moonrock_snapshot"]').attr('value', item.data.values[measure_nid]);
          break;
        case 'moonrock_sample':
          $('input[measure_content_type="moonrock_sample"]').attr('value', item.data.values[measure_nid]);
          break;
        default:
          var name = 'onepageprofile_categories[' + item.data.selected_measures_nid + '-' + measure_nid + '][value]';
          $('[name="' + name + '"]').val(item.data.values[measure_nid]);
          break;
      }
    }
  },
  
  clearForm: function() {
    this.dataModified = false;
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('clearSelection');
    }
    
    $('input[name="data_nid"]').attr('value', '');
    $('input[measure_content_type="moonrock_snapshot"]').attr('value', '');
    $('input[measure_content_type="moonrock_color"]').attr('value', '');
    //$('input[measure_content_type="moonrock_sample"]').attr('value', '');
    
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
            self.clearForm();
            MoonrockDataInputDataBrowser.select(false);
            self.setModeEdit(false);
            MoonrockDataInputDataBrowser.refresh();
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
    $('input[measure_content_type="moonrock_snapshot"]').attr('value', '');
    this.submitData();
  },
  deleteData: function() {
    
  }  
};

$(function() {
  MoonrockDataInput.init();
});

