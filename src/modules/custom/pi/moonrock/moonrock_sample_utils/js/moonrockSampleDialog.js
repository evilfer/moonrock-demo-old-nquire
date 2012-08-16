

var MoonrockSampleDialog = {
  
  init: function () {
    $(".moonrocksampledialog").dialog({
      title: "Sample",
      width: 600,
      height: 400,
      autoOpen: false
    }).dialogExtend({
      "maximize" : true,
      "minimize" : true,
      "collapse" : true,
      "dblclick" : "collapse"
    });
    
    
    $("#moonrocknewsnapshotdialog").dialog({
      title: "Sample snapshot",
      width: "auto",
      autoOpen: false,
      modal: true
    });
    
    $("img.moonrocksampleimage").click(function() {
      var sampleid = $(this).attr("sample");
      MoonrockSampleDialog.openSample(sampleid);
    });
    
    $(".moonrocksampledialogmenunew").click(function() {
      var sampleid = $(this).parent(".moonrocksampledialogmenu").attr("sample");
      MoonrockSampleDialog.openSnapshotForm(sampleid, "parameters");
    });
  },
  
  openSample : function(sampleid) {
    var dialogselector = ".moonrocksampledialog[sample='" + sampleid + "']";
    if ($(dialogselector).dialog("isOpen")) {
      $(dialogselector).dialogExtend("restore");
    } else {
      $(dialogselector).dialog("open");
    }
    
    $(dialogselector).find(".moonrocksampledialogmenuname").html("");
    $(dialogselector).find(".moonrocksampledialogmenureload").css("display", "none");
    $(dialogselector).find(".moonrocksampledialogmenuchoose").css("display", "none");
  },
  
  openSnapshotForm : function(sampleid, vmParameters) {
    $("#edit-sample-ref").attr("value", sampleid);
    $("#edit-vm-parameters").attr("value", vmParameters);
    $('#moonrocknewsnapshotdialog').dialog("open");
  },
  
  cancelNewSnapshot: function() {
    $('#moonrocknewsnapshotdialog').dialog("close");
  },
  
  submitNewSnapshot: function() {
    var data = $("#moonrock-snapshot-form").serialize();
    $.ajax({
      type: "POST",
      url: "?q=moonrock_sample_ajax/newsnapshot/submit",
      data: data,
      success: function(data) {
        if (data.status) {
          MoonrockSampleDialog.setSnapshot(data.data.title, data.data.parameters);
        }
      }
    });
  }
  
};



