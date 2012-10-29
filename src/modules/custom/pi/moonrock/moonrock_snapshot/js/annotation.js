

var SnapshotAnnotation = {
  _changeListeners: {},
  
  init: function() {
    this._element = $('#snapshot-annotation');
    if (this._element.length > 0) {
      var self = this;
      
      $('#snapshot-annotation-annotate').click(function() {
        self._setButtonsEnabled(false);
        GraphicAnnotation.setEnabled(true);
      });
      
      GraphicAnnotation.addChangeListener('snapshotAnnotation', function(action) {
        if (action == 'done') {
          self._storeData(GraphicAnnotation.getCurrentAnnotation());
          self._setButtonsEnabled(true);
        } else if (action == 'cancel') {
          self._setButtonsEnabled(true);
        }
        
        self._notify(action);
      });
    }
  },
  addChangeListener: function(id, callback) {
    this._changeListeners[id] = callback;
  },
  acceptCurrentValue: function() {
    GraphicAnnotation.acceptCurrentValue();
    this._storeData(GraphicAnnotation.getCurrentAnnotation());
    this._setButtonsEnabled(true);
  },
  
  _setButtonsEnabled: function(enabled) {
    if (enabled) {
      $('#snapshot-annotation > button').removeAttr('disabled');
    } else {
      $('#snapshot-annotation > button').attr('disabled', 'disabled');
    }
  },
  
  _notify: function(action) {
    for(var i in this._changeListeners) {
      this._changeListeners[i](action);
    }
  },
  
  clear: function() {
    GraphicAnnotation.clear();
  },  
  setItem: function(item) {
    GraphicAnnotation.setEnabled(false);
    this._loadData(item.data.snapshot_vm_annotation);
    this._setButtonsEnabled(true);
  },
  _storeData: function(annotation) {
    $('input[measure_content_type="moonrock_snapshot_annotation"]').attr('value', annotation);
  },
  _loadData: function(annotation) {
    $('input[measure_content_type="moonrock_snapshot_annotation"]').attr('value', annotation);
    GraphicAnnotation.importAnnotation(annotation);
  }
}


$(function() {
  MoonrockModules.register('SnapshotAnnotation', SnapshotAnnotation, ['GraphicAnnotation']);
});