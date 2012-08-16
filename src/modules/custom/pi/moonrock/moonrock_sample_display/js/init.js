

$(function() {  
  
  if (typeof(MoonrockSampleDialog) != "undefined") {
    MoonrockSampleDialog.init();
  }
  
  if (typeof(MoonrockSampleSearch) != "undefined") {
    MoonrockSampleSearch.init();
    $(".collapsibleContainer").collapsiblePanel();
  }
  
  if (typeof(SampleSelectionHelper) != "undefined") {
    SampleSelectionHelper.init();
  }
  
});
