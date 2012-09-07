

var MoonrockSampleDialog = {

  init: function() {
    $("#moonrock-sample-newsnapshot-dlg").dialog({
      title: "Create snapshot",
      width: "auto",
      autoOpen: false,
      modal: true,
      zIndex: 3500
    });
  },

  open : function(itemId) {
    var snapshooting = $('#moonrock-sample-search-snapshots').length > 0;

    var dialog = $('<div/>').vmDialog({
      id:  itemId,
      url: MoonrockSampleView.getBaseURL() + '/sample_dialog',
      snapshooting: snapshooting
    }, ".item-browser-item[item-id='" + itemId + "']", function(dialog) {
      dialog.find('.moonrock-sample-dlg').vmManager();
    });
  },

  
  openEditSnapshotForm: function(sampleElement) {
    this.prepareSnapshotForm(sampleElement, true);
  },
  
  openNewSnapshotForm : function(sampleElement) {
    this.prepareSnapshotForm(sampleElement, false);
  },
  prepareSnapshotForm: function(sampleElement, isEditing) {
    this._callingSampleElement = sampleElement;

    /**
     * temporary trick
     */
    var sampleInfo = sampleElement.vmManager('sampleInfo');
    var img = $('.item-browser-item[item-id="' + sampleInfo.id + '"]').find('.item-browser-item-img').attr('src');

    $("#edit-sample-ref").attr("value", sampleInfo.id);
    $("#moonrock-snapshot-form-sample").html(sampleInfo.name);
    $("#moonrock-snapshot-form-img").attr('src', img);
    $("#edit-vm-parameters").attr("value", "vmParameters");
    $('#moonrock-snapshot-form-messages').html("");

    if (isEditing) {
      var snapshotInfo = sampleElement.vmManager('snapshotInfo');
      $('#moonrock-sample-newsnapshot-dlg').find('.ui-dialog-title').html('Edit snapshot: ' + snapshotInfo.name);
      $("#edit-snapshot-id").attr("value", snapshotInfo.id);
      $("#edit-title").attr("value", snapshotInfo.name);
      $("#edit-notes").attr("value", snapshotInfo.notes);
    } else {
      $('#moonrock-sample-newsnapshot-dlg').find('.ui-dialog-title').html('New snapshot');
      $("#edit-title").attr("value", "");
      $("#edit-notes").attr("value", "");
    }
    $('#moonrock-sample-newsnapshot-dlg').dialog("open");
  },

  cancelSnapshot: function() {
    this._callingSampleElement = null;
    $('#moonrock-sample-newsnapshot-dlg').dialog("close");
  },

  submitSnapshot: function() {
    var data = $("#moonrock-snapshot-form").serialize();

    $.ajax({
      type: "POST",
      url: "?q=moonrock_sample_ajax/newsnapshot/submit",
      data: data,
      dataType: 'json',
      success: function(data) {
        if (data.status) {
          MoonrockSampleDialog._callingSampleElement.vmManager('setSnapshot', data.snapshot);
          MoonrockSampleDialog.cancelSnapshot();
          if (typeof(MoonrockSampleView) !== 'undefined') {
            MoonrockSampleView.newSnapshot(data.snapshot);
          }
        } else {
          $('#moonrock-snapshot-form-messages').html(data.data);
        }
      }
    });
  }
};



