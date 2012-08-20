

var MoonrockSampleDialog = {
  
  init: function () {
    $("#moonrocknewsnapshotdialog").dialog({
      title: "Sample snapshot",
      width: "auto",
      autoOpen: false,
      modal: true
    });

    this.sampleListUpdated();
  },
  
  _getSampleDialogUrl: function(itemid) {
    var currentpath = window.location.search;
    var pos = currentpath.indexOf("activity/");
    var pos2 = currentpath.indexOf("/", pos + "activity/".length);
    if (pos >= 0 && pos2 >= 0) {
      return currentpath.substr(0, pos2) + "/sample_dialog"
    } else {
      return "?q=moonrock_sample_ajax/sample_dialog";
    }
  },
  
  _open : function(itemid, type) {
    var dialogselector = ".moonrocksampledialog[" + type + "='" + itemid + "']";
    if (type == 'sample') {
      dialogselector += ":not([snapshot])";
    }
    
    if ($(dialogselector).length > 0) {
      $(dialogselector).dialog("moveToTop").dialogExtend("restore");
    } else {
      $("<div/>").load(this._getSampleDialogUrl(itemid), {
        nid: itemid
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
    this._enableButton(dialogElement, 'reload', false);
    
        
    $(dialogElement).find(".moonrocksampledialogmenusave").click(function() {
      if ($(this).hasClass("enabled")) {
        MoonrockSampleDialog.openSnapshotForm($(this).parents(".moonrocksampledialog"));
      }
    });
  },
  
  _setDialogTitle : function(dialogElement) {
    var info = this._getDialogInfo(dialogElement);
    var title = info.sampleTitle;
    if (info.snapshotTitle) {
      title += " | " + info.snapshotTitle;
    }
    
    $(info.element).find(".moonrocksampledialogmenuname").html(title);
  },
  
  _getDialogInfo : function(dialogElement) {
    var element = $(dialogElement).hasClass(".moonrocksampledialog") ? dialogElement : $(dialogElement).find(".moonrocksampledialog");

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
      $(dialogElement).find(".moonrocksampledialogmenu" + button).addClass("enabled");
    } else {
      $(dialogElement).find(".moonrocksampledialogmenu" + button).removeClass("enabled");
    }
  },
  
  _setSnapshot : function(dialogElement, snapshot) {
    $(dialogElement).attr("snapshot", snapshot.nid);
    $(dialogElement).attr("snapshot_name", snapshot.title);
    this._setDialogTitle(dialogElement);
  },
  
  openSnapshotForm : function(dialogElement) {
    this._callingSampleDialog = dialogElement;
    var info = this._getDialogInfo(dialogElement);
    
    $("#edit-sample-ref").attr("value", info.sample);
    $("#edit-vm-parameters").attr("value", "vmParameters");
    $('#moonrocknewsnapshotdialog').dialog("open");
    $("#edit-title").attr("value", "");
    $("#edit-notes").attr("value", "");
  },
  
  cancelNewSnapshot: function() {
    this._callingSampleDialog = null;
    $('#moonrocknewsnapshotdialog').dialog("close");
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
          if (typeof(MoonrockSampleSearch) != 'undefined') {
            MoonrockSampleSearch.repeatSearch();
          }
        }
      }
    });
  },
  
  sampleListUpdated: function() {
    $("img.moonrocksampleimage").unbind("click");
    $("img.moonrocksampleimage").click(function() {
      var parent = $(this).parents(".moonrocksample");
      var id = $(parent).attr("sample");
      var type = $(parent).hasClass("moonrocksamplesnapshot") ? 'snapshot' : 'sample';
      MoonrockSampleDialog._open(id, type);
    });
  }
};



