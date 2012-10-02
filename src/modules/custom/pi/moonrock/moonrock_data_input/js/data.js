

var MoonrockDataInput = {
  dataModified: false,
  
  init: function() {
    console.log('datainput');
    this.imageHelper = MoonrockDataInputImage;
    this.dataBrowser = MoonrockDataInputDataBrowser;
    
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
    
    $('#moonrock-data-input-button-newdata').click(function() {
      if ($(this).hasClass('enabled')) {
        self.newData();
      }
    });    
    $('#moonrock-data-input-button-save').click(function() {
      if ($(this).hasClass('enabled')) {
        self.saveData();
      }
    });
    
    $('form').find('input[type="text"], textarea').keypress(function() {
      self._userDataChanged();
    });
    $('select').change(function() {
      self._userDataChanged();
    });
    $('body').rockColorPicker('addUserSelectionCallback', function() {
      self._userDataChanged();
    });
  },
  
  setModeEdit: function(editing) {
    if (editing) {
      $('#moonrock-data-input-header-new').hide();
      $('#moonrock-data-input-header-edit').show();
      
      this._setButtons({
        save: 'disabled',
        saving: 'hidden',
        saved: 'hidden',
        newdata: 'enabled',
        deletedata: 'enabled',
        cancel: 'hidden'
      });
    } else {
      $('#moonrock-data-input-header-edit').hide();
      $('#moonrock-data-input-header-new').show();
      
      this._setButtons({
        save: 'disabled',
        saving: 'hidden',
        saved: 'hidden',
        newdata: 'hidden',
        deletedata: 'hidden',
        cancel: 'enabled'
      });
    }
  },
  _setButtons: function(modes) {
    for(var button in modes) {
      this._setButton(button, modes[button]);
    }
  },
  _setButton: function(button, mode) {
    var element = $('#moonrock-data-input-button-' + button);
    switch(mode) {
      case 'enabled':
        element.addClass('enabled').removeClass('moonrock-data-input-hidden');
        break;
      case 'disabled':
        element.removeClass('enabled').removeClass('moonrock-data-input-hidden');
        break;
      case 'hidden':
        element.addClass('moonrock-data-input-hidden');
        break;
      default:
        break;
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
    
    this.clearDataIds();
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('clearSelection');
    }
    $('input[measure_content_type="moonrock_color"]').attr('value', '');
    $('input[type="text"], textarea').val('');
    $('select').val(null);
  },
  clearDataIds: function() {
    $('input[name="data_nid"]').attr('value', '');
    $('input[measure_content_type="moonrock_snapshot"]').attr('value', '');
  },
  updateSampleData: function(sample) {
    $('input[measure_content_type="moonrock_sample"]').attr('value', sample.id);
    $('#moonrock-measure-fixedvalue-sample').html(sample.title);
  },
  
  getSubmitURL: function() {
    return '?q=moonrock_data_input/' + MoonrockVmViewManager.getActivityId() + '/submit';
  },

  /**
   * Submits the form to update the data item being currently edited, 
   * or to create a new one.
   */
  submitData: function() {
    var self = this;
    
    /*
     * Request the current snapshot from the Virtual Microscope, submits when ready.
     */
    this.imageHelper.getVMSnapshot(function(snapshot) {
      $('input[measure_content_type="moonrock_snapshot_image"]').attr('value', snapshot.image);
      $('input[measure_content_type="moonrock_snapshot_parameters"]').attr('value', snapshot.vm_parameters);
      $('input[measure_content_type="moonrock_snapshot_notes"]').attr('value', $('form#node-form').find('.form-textarea').val());
      
      $.ajax({
        url: self.getSubmitURL(),
        type: "POST",
        dataType: 'json',
        data: $('form').serialize(),
        success: function(data) {
          if (data.status) {
            self.dataBrowser.updateItem(data.item);
            self.setItem(data.item);
          } else {
            self.submissionError(data.error, 'data');
          }
        },
        error: function(jqXHR, textStatus) {
          self.submissionError(jqXHR, textStatus);
        }
      });
    });
  },
    
  
  saveData: function() {
    this._setButtons({
      save: 'hidden',
      saving: 'disabled',
      saved: 'hidden'
    });
    this.submitData();
  },
  newData: function() {
    this.clearDataIds();
    this.setModeEdit(false);
    this.dataBrowser.select(null);
  },
  deleteData: function() {
    
  },
  
  _userDataChanged: function(submit) {
    console.log('change ' + (new Date()).getTime());
    this._setButtons({
      save: 'enabled',
      saving: 'hidden',
      saved: 'hidden'
    });
  }
};

$(function() {
  MoonrockDataInput.init();
});

