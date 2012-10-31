

var MoonrockDataInput = {
  initialItemId: false,
  currentItemId: false,
  
  init: function() {
    this.actionsHelper = ActionsManager;
    this.dataBrowser = MoonrockDataInputDataBrowser;
    this.vmComm = MoonrockVMComm;
    
    var self = this;
    
    VmManager.addSampleSelectionCallback(function(sample) {
      self.setSample(sample);
    });
    
    var data_nid = $('input[name="data_nid"]').attr('value');
    if (data_nid) {
      var sample = MoonrockSeeSamples.getItem($('input[measure_content_type="moonrock_sample"]').attr('value'));
      VmManager.sampleSelected(sample);
      MoonrockDataInputDataBrowser.select(data_nid);
      this._initItemId(data_nid);
      this.setModeEdit(true);
    } else {
      this.setModeEdit(false);
    }
    
    $('#moonrock-data-input-button-createdata').click(function() {
      if ($(this).hasClass('enabled')) {
        self.createData();
      }
    });    
    $('#moonrock-data-input-button-savenew').click(function() {
      if ($(this).hasClass('enabled')) {
        self.saveData();
      }
    });
    $('#moonrock-data-input-button-savechanges').click(function() {
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
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('addUserSelectionCallback', function() {
        self._bigDataChange();
      });
    }
    
    
    $('div[vm_measure]').each(function() {
      $(this).vmMeasureField({
        changeCallback: function(complete) {
          if (complete) {
            self._bigDataChange();
          } else {
            self._smallDataChange();
          }
        }
      });
    });
    
    SnapshotAnnotation.addChangeListener('dataform', function(action) {
      if (action == 'done') {
        self._bigDataChange();
      } else if (action == 'change') {
        self._smallDataChange();
      }
    });
    
    $('body').append($('<div/>').addClass('moonrock-block-overlay').hide());
  },
  
  _enableOverlay: function(enabled) {
    var overlay = $('.moonrock-block-overlay');
    
    if (enabled) {
      var block = $('#moonrock-data-form-block');
      overlay.css({
        width: block.width(),
        height: block.height(),
        top: block.offset().top,
        left: block.offset().left
      }).show();
    } else {
      overlay.hide();
    }
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
    this._editing = editing;
    if (editing) {
      $('#moonrock-data-input-header-new').hide();
      $('#moonrock-data-input-header-edit').show();
      this._setSaveButtons('saved');
      this._setDataManagementButtons(true);
    } else {
      $('#moonrock-data-input-header-edit').hide();
      $('#moonrock-data-input-header-new').show();
      this._setSaveButtons('savenew');
      this._setDataManagementButtons(false);
    }
  },
  _setDataManagementButtons : function(enabled) {
    var mode = enabled ? 'enabled' : 'hidden';
    this._setButtons({
      createdata: mode,
      deletedata: mode
    });
  },
  _setSaveButtons: function(savemode) {
    var buttons = {};
    
    var f = function(button) {
      buttons[button] = button === savemode ? 'enabled' : 'hidden';
    };
    
    f('savenew');
    f('savechanges');
    f('saving');
    f('saved');
    
    this._setButtons(buttons);
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
  
  setSample: function(sample) {
    this.clearForm();
    this.setModeEdit(false);
    this.dataBrowser.select(null);
      
    this.updateSampleData(sample);
    this.actionsHelper.setSample(sample.id);
  },
  
  vmPositionChanged: function(position) {
    var newPosition = JSON.stringify(position);
    if (newPosition != this.currentPosition) {
      this.currentPosition = newPosition;
      this._smallDataChange();
    }
  },
  
  setItem: function(item) {
    var self = this;
    this.currentItemId = item.id;
    
    
    if (item) {
      this.vmComm.removePositionChangeListener('dataform');
      this.currentPosition = item.data.snapshot_vm_position;
      this.vmComm.setVMParams(item.data.snapshot_vm_position);
      this.vmComm.addPositionChangeListener('dataform', function(position) {
        self.vmPositionChanged(position);
      });
    }
    
    this.setModeEdit(true);
    this.clearForm();
    MoonrockDataInputDataBrowser.select(item.id);
    
    $('input[name="data_nid"]').val(item.id);
    
    if (item) {
      for (var measure_nid in item.data.values) {
        var content = item.data.measures_content[measure_nid];
        switch (content) {
          case 'moonrock_color':
            if ($.fn.rockColorPicker) {
              if (item.data.values[measure_nid]) {
                $('body').rockColorPicker('select', item.data.values[measure_nid]);
              } else {
                $('body').rockColorPicker('clearSelection'); 
              }
            }
            break;
          case 'moonrock_snapshot':
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
      
    }
    
    SnapshotAnnotation.setItem(item);
    $('.moonrock-measure-field').vmMeasureField('fieldValueUpdated');
  },
  
  clearForm: function() {
    this.dataModified = false;
    
    this.clearDataIds();
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('clearSelection');
    }
    $('input[measure_content_type="moonrock_color"]').attr('value', '');
    $('.moonrock-measure-field').vmMeasureField('setValue', '');
    $('input[type="text"], textarea').val('');
    $('select').val(null);
    
    SnapshotAnnotation.clear();
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
        this.createData();
        break;
      default:
        break;
    }
    this._opCompleted(op);
  },
  undoRedoData: function(action) {
    this._enableOverlay(true);
    
    var self = this;
    var callback = function(op, data) {
      self._processUndoRedoResult(op, data);
    };
    
    this.setUndoRedoButtons('');
    
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
    this._enableOverlay(false);
    if (op === 'delete') {
      this._setSaveButtons('save');
    } else {
      this._setSaveButtons('saved');
    }
  },
  
  saveData: function() {
    this._setSaveButtons('saving');
    this._enableOverlay(true);

    $('.moonrock-measure-field').vmMeasureField('acceptCurrentMeasure');
    SnapshotAnnotation.acceptCurrentValue();
    
    this.submitData();
  },
  createData: function() {
    this.currentItemId = null;
    
    this.clearForm();
    this.setModeEdit(false);
    this.dataBrowser.select(null);
  },
  deleteData: function() {
    var self = this;
    
    if (confirm('Are you sure you want to delete this data item?')) {
      this.actionsHelper.deleteItem(self.currentItemId, function() {
        self.dataBrowser.removeItem(self.currentItemId);        
        self.createData();
      });
    }
  },
  
  _smallDataChange: function() {
    if (this._editing) {
      this._setSaveButtons('savechanges');
    }
  },
  _bigDataChange: function() {
    this.saveData();
  }
};

$(function() {
  MoonrockModules.register('MoonrockDataInput', MoonrockDataInput, ['MoonrockColorSelect', 'SnapshotAnnotation']);
});

