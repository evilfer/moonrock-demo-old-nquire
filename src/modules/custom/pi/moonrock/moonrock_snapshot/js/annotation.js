

var SnapshotAnnotation = {
  _changeListeners: {},
  
  init: function() {
    this._element = $('#snapshot-annotation');
    if (this._element.length > 0) {
      var self = this;
      
      $('#snapshot-annotation-annotate').click(function() {
        $('#snapshot-annotation > button').attr('disabled', 'disabled');
        GraphicAnnotation.setEnabled(true);
      });
      
      GraphicAnnotation.addChangeListener('snapshotAnnotation', function(action) {
        if (action == 'done') {
          GraphicAnnotation.setEnabled(false);
          self._storeData();
          $('#snapshot-annotation > button').removeAttr('disabled');
        }
        
        self._notify(action);
      });
    }
  },
  addChangeListener: function(id, callback) {
    this._changeListeners[id] = callback;
  },
  acceptCurrentValue: function() {
    
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
    this._loadData(item.data.snapshot_vm_annotation);
  },
  _storeData: function() {
    var annotation = GraphicAnnotation.exportAnnotation();
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