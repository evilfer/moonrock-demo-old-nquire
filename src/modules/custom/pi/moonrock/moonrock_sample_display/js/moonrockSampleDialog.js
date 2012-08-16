

var MoonrockSampleDialog = {
  
  init: function () {
    var x = $(".moonrocksampledialog").dialog({
      title: "Sample",
      width: 300,
      height: 200,
      autoOpen: false
    }).dialogExtend({
      "maximize" : true,
      "minimize" : true,
      "collapse" : true,
      "dblclick" : "collapse"
    });
    
    $("img.moonrocksampleimage").click(function() {
      var sampleid = $(this).attr("sample");
      var dialogselector = ".moonrocksampledialog[sample='" + sampleid + "']";
      if ($(dialogselector).dialog("isOpen")) {
        $(dialogselector).dialogExtend("restore");
      } else {
        $(dialogselector).dialog("open");
      }
    });
  }
  
};



