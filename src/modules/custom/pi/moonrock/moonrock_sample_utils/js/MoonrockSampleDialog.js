

var MoonrockSampleDialog = {

  init: function() {
    $("#moonrock-sample-newsnapshot-dlg").dialog({
      title: "Create snapshot",
      width: "auto",
      autoOpen: false,
      modal: true
    });
  },

  open : function(itemId) {
    var snapshooting = $('#moonrock-sample-search-snapshots').length > 0;

    var dialog = $('<div/>').vmDialog({
      id:  itemId,
      url: MoonrockSampleView.getBaseURL() + '/sample_dialog',
      snapshooting: snapshooting
    }, ".item-browser-item[item-id='" + itemId + "']", function(dialog) {
      MoonrockSampleDialog._initDialog(dialog);
    });
  },

  _initDialog: function(dialogElement) {

    this._setDialogTitle(dialogElement);
    this._enableButton(dialogElement, 'save', true);
    //this._enableButton(dialogElement, 'reload', false);

    $(dialogElement).find(".moonrock-sample-dlg-menu-save").click(function() {
      if ($(this).hasClass("enabled")) {
        MoonrockSampleDialog.openSnapshotForm($(this).parents(".moonrock-sample-dlg"));
      }
    });
  },

  _setDialogTitle : function(dialogElement) {
    var info = this._getDialogInfo(dialogElement);
    var title = info.sampleTitle;
    if (info.snapshotTitle) {
      title += " > " + info.snapshotTitle;
    }

    $(dialogElement).find('.vm-dlg-title').html(title);
  },

  _getDialogInfo : function(dialogElement) {
    var element = $(dialogElement).hasClass(".moonrock-sample-dlg") ? dialogElement : $(dialogElement).find(".moonrock-sample-dlg");

    return {
      element : element,
      sample : $(element).attr("sample"),
      snapshot : $(element).filter("[snapshot]").attr("snapshot"),
      sampleTitle : $(element).attr("sample_name"),
      snapshotTitle : $(element).attr("snapshot_name")
    };
  },

  _enableButton : function(dialogElement, button, enabled) {
    if (enabled) {
      $(dialogElement).find(".moonrock-sample-dlg-menu-" + button).addClass("enabled");
    } else {
      $(dialogElement).find(".moonrock-sample-dlg-menu-" + button).removeClass("enabled");
    }
  },

  _setSnapshot : function(dialogElement, snapshot) {
    $(dialogElement).attr("snapshot", snapshot.nid);
    $(dialogElement).attr("snapshot_name", snapshot.title);
    var parent = $(dialogElement).parents(".vm-dlg-dialog");
    parent.attr('item-id', snapshot.nid);
    this._setDialogTitle(parent);
  },

  openSnapshotForm : function(dialogElement) {
    this._callingSampleDialog = dialogElement;
    /**
     * temporary trick
     */
    var info = this._getDialogInfo(dialogElement);
    var img = $('.item-browser-item[item-id="' + info.sample + '"]').find('.item-browser-item-img').attr('src');

    $("#edit-sample-ref").attr("value", info.sample);
    $("#edit-vm-parameters").attr("value", "vmParameters");
    $('#moonrock-snapshot-form-messages').html("");
    $("#moonrock-snapshot-form-sample").html(info.sampleTitle);
    $("#moonrock-snapshot-form-img").attr('src', img);
    $("#edit-title").attr("value", "");
    $("#edit-notes").attr("value", "");
    $('#moonrock-sample-newsnapshot-dlg').dialog("open");
  },

  cancelNewSnapshot: function() {
    this._callingSampleDialog = null;
    $('#moonrock-sample-newsnapshot-dlg').dialog("close");
  },

  submitNewSnapshot: function() {
    var data = $("#moonrock-snapshot-form").serialize();

    $.ajax({
      type: "POST",
      url: "?q=moonrock_sample_ajax/newsnapshot/submit",
      data: data,
      dataType: 'json',
      success: function(data) {
        if (data.status) {
          MoonrockSampleDialog._setSnapshot(MoonrockSampleDialog._callingSampleDialog, data.snapshot);
          MoonrockSampleDialog.cancelNewSnapshot();
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



