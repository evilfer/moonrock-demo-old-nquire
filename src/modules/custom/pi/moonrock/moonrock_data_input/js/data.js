

var MoonrockDataInput = {
  initialItemId: false,
  currentItemId: false,
  
  init: function() {
    console.log('datainput');
    this.actionsHelper = ActionsManager;
    this.dataBrowser = MoonrockDataInputDataBrowser;
    this.vmComm = MoonrockDataInputVMComm;
    
    var self = this;
    
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample, sampleChanged) {
      self.setSample(sample, sampleChanged);
    });
    
    var data_nid = $('input[name="data_nid"]').attr('value');
    if (data_nid) {
      MoonrockVmViewManager.openSample($('input[measure_content_type="moonrock_sample"]').attr('value'));
      MoonrockDataInputDataBrowser.select(data_nid);
      this._initItemId(data_nid);
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
    $('#moonrock-data-input-button-undo').click(function() {
      if ($(this).hasClass('enabled')) {
        self.undoRedoData('undo');
      }
    });
    $('#moonrock-data-input-button-redo').click(function() {
      if ($(this).hasClass('enabled')) {
        self.undoRedoData('redo');
      }
    });
    $('#moonrock-data-input-button-deletedata').click(function() {
      if ($(this).hasClass('enabled')) {
        self.deleteData();
      }
    });
    
    $('form').find('input[type="text"], textarea').keydown(function() {
      self._smallDataChange();
    });
    $('form').find('select, input[type="text"], textarea').change(function() {
      self._bigDataChange();
    });
    $('body').rockColorPicker('addUserSelectionCallback', function() {
      self._bigDataChange();
    });
  },
  
  _initItemId: function(itemId) {
    this.initialItemId = itemId;
  },
  itemAdded: function(item) {
    if (item.id == this.initialItemId) {
      this.initialItemId = false;
      this.setItem(item);
    }
  },
  setModeEdit: function(editing) {
    if (editing) {
      $('#moonrock-data-input-header-new').hide();
      $('#moonrock-data-input-header-edit').show();
      
      this._setButtons({
        save: 'disabled',
        saving: 'hidden',
        newdata: 'enabled',
        deletedata: 'enabled'
      });
    } else {
      $('#moonrock-data-input-header-edit').hide();
      $('#moonrock-data-input-header-new').show();
      
      this._setButtons({
        save: 'enabled',
        saving: 'hidden',
        newdata: 'hidden',
        deletedata: 'hidden'
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
      this.dataBrowser.select(null);
    }
    this.updateSampleData(sample);
    this.actionsHelper.setSample(sample.id);
  },
  
  vmPositionChanged: function(position) {
    console.log(position);
    this._smallDataChange();
  },
  
  setItem: function(item) {
    var self = this;
    this.currentItemId = item.id;
    
    this.vmComm.stopPositionMonitoring();
    
    if (item) {
      var monitor = function() {
        self.vmComm.monitorPositionChange(function(position) {
          self.vmPositionChanged(position);
        });
      };
      this.vmComm.setVMParams(item.data.snapshot_vm_parameters);
      setTimeout(monitor, 1000);
    }
    
    this.setModeEdit(true);
    this.clearForm();
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
  
  _processUndoRedoResult: function(op, data) {
    switch(op) {
      case 'update':
        this.dataBrowser.updateItem(data);
        this.setItem(data);
        break;
      case 'delete':
        this.dataBrowser.removeItem(data);
        this.newData();
        break;
      default:
        break;
    }
  },
  undoRedoData: function(action) {
    var self = this;
    var callback = function(op, data) {
      self._processUndoRedoResult(op, data);
    };
    if (action === 'undo') {
      this.actionsHelper.undo(callback);
    } else {
      this.actionsHelper.redo(callback);
    }
  },
  
  setUndoRedoButtons: function(mode) {
    var f = function(filter) {
      return mode.indexOf(filter) >= 0 ? 'enabled' : 'disabled';
    }
    this._setButtons({
      undo: f('undo'),
      redo: f('redo')
    });
  },

  /**
   * Submits the form to update the data item being currently edited, 
   * or to create a new one.
   */
  submitData: function() {
    var self = this;
    
    var process = function(item) {
      self.dataBrowser.updateItem(item);
      self.setItem(item);
      self._opCompleted('save');
    };
    
    self.actionsHelper.saveItem(self.currentItemId, process);
  },
  _opCompleted: function(op) {
    switch(op) {
      case 'save':
        this._setButton('cancel', 'enabled')
        break;
      case 'cancel':
        this._setButton('cancel', 'disabled')
        break;
      default:
        break;
    }
       
    this._setButtons({
      save: 'disabled',
      saving: 'hidden'
    });
  },
  
  saveData: function() {
    this._setButtons({
      save: 'hidden',
      saving: 'disabled',
      saved: 'hidden',
      cancel: 'enabled'
    });
    this.submitData('save');
  },
  newData: function() {
    this.currentItemId = null;
    
    this.clearDataIds();
    this.setModeEdit(false);
    this.dataBrowser.select(null);
  },
  deleteData: function() {
    var self = this;
    
    if (confirm('Are you sure you want to delete this data item?')) {
      this.actionsHelper.deleteItem(self.currentItemId, function() {
        self.dataBrowser.removeItem(self.currentItemId);
        
        self.newData();
      });
    }
  },
  
  _smallDataChange: function() {
    console.log('small change ' + (new Date()).getTime());
    this._setButtons({
      save: 'enabled',
      saving: 'hidden',
      saved: 'hidden',
      cancel: 'enabled'
    });
  },
  _bigDataChange: function() {
    console.log('big change ' + (new Date()).getTime());
    this.saveData();
  }
};

$(function() {
  MoonrockDataInput.init();
});

