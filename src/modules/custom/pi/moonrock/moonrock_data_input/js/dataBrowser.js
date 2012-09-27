

var MoonrockDataInputDataBrowser = {
  init: function() {
    var self = this;
    $('#moonrock-data-browser').itemBrowser();
    
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample) {
      self.refresh(sample.id);
    });
  },
  
  getBaseURL : function() {
    return "?q=moonrock_data_input/data";
  },
  
  refresh: function(sampleId) {
    $('#moonrock-data-browser-throbber').itemBrowserThrobber("on");

    $.ajax({
      url: this.getBaseURL(),
      dataType: 'json',
      data: {
        nid: sampleId
      },
      success: function(data) {
        $('#moonrock-data-browser-throbber').itemBrowserThrobber("off");
        if (data.status) {
          $('#moonrock-data-browser').itemBrowser('setItems', data.items);
        }
      },
      error: function() {
        $('#moonrock-data-browser-throbber').itemBrowserThrobber("off");
      }
    });
  }
};

$(function() {
  MoonrockDataInputDataBrowser.init(); 
});



