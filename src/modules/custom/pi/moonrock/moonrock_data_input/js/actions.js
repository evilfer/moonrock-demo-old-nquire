

var ActionsManager = {
  sampleActionData: {},
  currentActionData: null,
  
  init: function() {
    this.imageHelper = MoonrockVMComm;
    this.dataManager = MoonrockDataInput;
    this.dataBrowser = MoonrockDataInputDataBrowser;
  },
  
  setSample: function(sampleId) {
    if (!this.sampleActionData[sampleId]) {
      this.sampleActionData[sampleId] = {
        actions: [],
        actionIndex: 0
      };
    }
    this.currentActionData = this.sampleActionData[sampleId];
    this._updateButtons();
  },
  
    
  getBaseURL: function() {
    return '?q=moonrock_data_input/' + VmManager.getActivityId();
  },
  
  _copy: function(item) {
    return item ? $.extend(true, {}, item) : false;
  },
  _changeItemIds: function(oldId, newData) {
    var snapshotMeasure = newData.data.content_measures['moonrock_snapshot'];
    var newSnapshot = newData.data.values[snapshotMeasure];
    
    var updateItem = function(item) {
      if (item && item.id == oldId) {
        item.id = newData.id;
        item.data.values[snapshotMeasure] = newSnapshot;
      }
    };
    
    for (var i = 0; i < this.currentActionData.actions.length; i++) {
      updateItem(this.currentActionData.actions[i].oldItem);
      updateItem(this.currentActionData.actions[i].newItem);
    }
  },
  saveItem: function(itemId, callback) {
    this.dataManager.setUndoRedoButtons('');
    var self = this;
    
    var old = itemId ? this.dataBrowser.getItem(itemId) : false;
    
    var process = function(item) {
      var action = {
        type: itemId ? 'update' : 'create',
        oldItem: self._copy(old),
        newItem: self._copy(item)
      };
      self._appendAction(action);
      
      callback(item);
    };
    
    this._submitData(process);
  },
  undo: function(callback) {
    this.dataManager.setUndoRedoButtons('');
    this.currentActionData.actionIndex--;
    var action = this.currentActionData.actions[this.currentActionData.actionIndex];
    
    var self = this;
    
    switch(action.type) {
      case 'update':
        this.dataManager.setItem(action.oldItem);
        this._submitData(function(item) {
          self._updateButtons();
          action.oldItem = self._copy(item);
          callback('update', item);
        });
        break;
      case 'create':
        this._requestDeletion(action.newItem.id, function() {
          self._updateButtons();
          callback('delete', action.newItem.id);
        });
        break;
      case 'delete':
        var oldId = action.oldItem.id;
        this.dataManager.setItem(action.oldItem);
        this.dataManager.clearDataIds();

        this._submitData(function(item) {
          self._changeItemIds(oldId, item);
          action.oldItem = self._copy(item);
          self._updateButtons();
          callback('update', item);
        });
        break;
      default:
        break;
    }
    return;
  },
  redo: function(callback) {
    this.dataManager.setUndoRedoButtons('');
    var action = this.currentActionData.actions[this.currentActionData.actionIndex];
    this.currentActionData.actionIndex++;
    
    var self = this;
    
    switch(action.type) {
      case 'update':
        this.dataManager.setItem(action.newItem);
        this._submitData(function(item) {
          action.newItem = self._copy(item);
          self._updateButtons();
          callback('update', item);
        });
        break;
      case 'create':
        var oldId = action.newItem.id;
        this.dataManager.setItem(action.newItem);
        this.dataManager.clearDataIds();
        this._submitData(function(item) {
          self._changeItemIds(oldId, item);
          action.newItem = self._copy(item);
          self._updateButtons();
          callback('update', item);
        });
        break;
      case 'delete':
        this._requestDeletion(action.oldItem.id, function() {
          self._updateButtons();
          callback('delete', action.oldItem.id);
        });
        break;
      default:
        break;
    }
    return;  
  },
  deleteItem: function(itemId, callback) {
    this.dataManager.setUndoRedoButtons('');
    var self = this;
    
    var old = itemId ? this.dataBrowser.getItem(itemId) : false;
    
    var process = function(item) {
      var action = {
        type: 'delete',
        oldItem: old,
        newItem: false
      };
      self._appendAction(action);
      callback(item);
    };
    
    this._requestDeletion(itemId, process);
  },
  _requestDeletion: function(itemId, callback) {
    var self = this;
    
    $.ajax({
      url: self.getBaseURL() + '/delete',
      type: "POST",
      dataType: 'json',
      data: {
        data_nid: itemId
      },
      success: function(data) {
        if (data.status) {
          callback(false);
        } else {
          self.submissionError(data.error, 'data');
        }
      },
      error: function(jqXHR, textStatus) {
        self.submissionError(jqXHR, textStatus);
      }
    });
  },
  
  _appendAction: function(action) {
    var toRemove = this.currentActionData.actions.length - this.currentActionData.actionIndex;
    this.currentActionData.actions.splice(this.currentActionData.actionIndex, toRemove);
    this.currentActionData.actions.push(action);
    this.currentActionData.actionIndex ++;
    this._updateButtons();
  },
  _updateButtons: function() {
    var mode ='';
    if (this.currentActionData.actionIndex > 0) {
      mode += 'undo';
    }
    if (this.currentActionData.actionIndex < this.currentActionData.actions.length) {
      mode += 'redo';
    }
    this.dataManager.setUndoRedoButtons(mode);
  },
  /**
   * Submits the form to update the data item being currently edited, 
   * or to create a new one.
   */
  _submitData: function(callback) {
    var self = this;    
    /*
     * Request the current snapshot from the Virtual Microscope, submits when ready.
     */
    this.imageHelper.getVMSnapshot(function(snapshot) {
      $('input[measure_content_type="moonrock_snapshot_image"]').attr('value', snapshot.image);
      $('input[measure_content_type="moonrock_snapshot_position"]').attr('value', snapshot.position);
      $('input[measure_content_type="moonrock_snapshot_viewurl"]').attr('value', snapshot.viewurl);
      $('input[measure_content_type="moonrock_snapshot_notes"]').attr('value', $('form#node-form').find('.form-textarea').val());
      
      $.ajax({
        url: self.getBaseURL() + '/submit',
        type: "POST",
        dataType: 'json',
        data: $('form').serialize(),
        success: function(data) {
          if (data.status) {
            callback(data.item);
          } else {
            self.submissionError(data.error, 'data');
          }
        },
        error: function(jqXHR, textStatus) {
          self.submissionError(jqXHR, textStatus);
        }
      });
    });
  }
};

$(function() {
  MoonrockModules.register('ActionsManager', ActionsManager);
});



