

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

    var dialogselector = ".moonrock-sample-dlg[item-id='" + itemId + "']";

    if ($(dialogselector).length > 0) {
      $(dialogselector).dialog("moveToTop").dialogExtend("restore");
    } else {
      var url = MoonrockSampleView.getBaseURL() + '/sample_dialog'
      $("<div/>").load(url, {
        nid: itemId,
        snapshooting: snapshooting
      }, function() {
        MoonrockSampleDialog._initDialog(this);
      });
    }
  },

  _initDialog: function(dialogElement) {
    $(dialogElement).dialog({
      title: "",
      width: 600,
      height: 400,
      close: function() {
        if ($(this).dialog("option", "destroyOnClose")) {
          $(this).remove();
        }
      }
    }).dialogExtend({
      "maximize" : true,
      "minimize" : true,
      "collapse" : true,
      "dblclick" : "collapse"
    }).dialog("option", "destroyOnClose", true);

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

    $(info.element).parents('.ui-dialog').find('.ui-dialog-title').html(title);
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
    this._setDialogTitle(dialogElement);
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
            MoonrockSampleView.repeatSnapshotSearch();
          }
        } else {
          $('#moonrock-snapshot-form-messages').html(data.data);
        }
      }
    });
  }
};



