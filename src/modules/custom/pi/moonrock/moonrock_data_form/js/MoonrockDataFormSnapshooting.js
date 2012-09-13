

var MoonrockDataFormSnapshooting = {
  
  currentItem: null,
  
  init: function() {
    var self = this;
    
    $('.moonrock-snapshot-menu-new').click(function() {
      if ($(this).hasClass('enabled')) {
        self._openNewSnapshot();
      }
    });
    $('.moonrock-snapshot-menu-edit').click(function() {
      if ($(this).hasClass('enabled')) {
        self._editCurrentSnapshot();
      }
    });
    $('.moonrock-snapshot-menu-center').click(function() {
      if ($(this).hasClass('enabled')) {
        self._centerView();
      }
    });
    $('.moonrock-snapshot-menu-search').click(function() {
      if ($(this).hasClass('enabled')) {
        self._searchView();
      }
    });
    
    $('#moonrock-sample-newsnapshot-dlg').dialog({
      title: "Create snapshot",
      width: "auto",
      autoOpen: false,
      modal: true
    });
  },
  
  _openNewSnapshot: function() {
    this._prepareSnapshotForm(false);
  },
  _editCurrentSnapshot: function() {
    this._prepareSnapshotForm(true);
  },
  _centerView: function() {
    
  },
  _searchView: function() {
    
  },
  
  vmOpened: function(item) {
    this.currentItem = item;
    this._updateButtons();
  },
  _updateButtons: function() {
    this.enableButton('new', this.currentItem != null);
    this.enableButton('edit', this.currentItem && this.currentItem.own_snapshot);
    this.enableButton('center', false);
    this.enableButton('search', false);
  },
  enableButton: function(button, enabled) {
    if (enabled) {
      $(".moonrock-snapshot-menu-" + button).addClass("enabled");
    } else {
      $(".moonrock-snapshot-menu-" + button).removeClass("enabled");
    }
    return this;
  },
  
  _prepareSnapshotForm: function(isEditing) {
    $("#edit-sample-ref").attr("value", this.currentItem.sample);
    $("#moonrock-snapshot-form-sample").html(this.currentItem.sample_title);
    $("#edit-vm-parameters").attr("value", "vmParameters");
    $('#moonrock-snapshot-form-messages').html("");
    
    MoonrockDataFormImage.getVMImageDataURL(200, function(uri) {
      $("#moonrock-snapshot-form-img").attr('src', uri);
      $("#edit-image-data").attr("value", uri);
    });

    if (isEditing) {
      $('#moonrock-sample-newsnapshot-dlg').find('.ui-dialog-title').html('Edit snapshot: ' + this.currentItem.snapshot_title);
      $("#edit-snapshot-id").attr("value", this.currentItem.snapshot);
      $("#edit-title").attr("value", this.currentItem.snapshot_title);
      $("#edit-notes").attr("value", this.currentItem.metadata.notes.value);
      $('#edit-snapshot-delete').show();
    } else {
      $('#moonrock-sample-newsnapshot-dlg').find('.ui-dialog-title').html('New snapshot');
      $("#edit-snapshot-id").attr("value", "");
      $("#edit-title").attr("value", "");
      $("#edit-notes").attr("value", "");
      $('#edit-snapshot-delete').hide();
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
      url: MoonrockDataFormSamples.getBaseURL() + '/submitsnapshot',
      data: data,
      dataType: 'json',
      success: function(data) {
        if (data.status) {
          MoonrockDataFormSnapshooting.cancelSnapshot();
          MoonrockDataFormSamples.snapshotSubmitted(data.item);
        } else {
          $('#moonrock-snapshot-form-messages').html(data.data);
        }
      }
    });
  }
  
};



