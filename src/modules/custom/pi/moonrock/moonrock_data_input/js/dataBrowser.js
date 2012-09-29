

var MoonrockDataInputDataBrowser = {
  selectedData: null,
  
  init: function() {
    var self = this;
    $('#moonrock-data-browser').itemBrowser({
      eventCallback: function(type, item) {
        if (type === 'imgclick') {
          MoonrockDataInput.setItem(item);
        }
      },
      imageLink: true
    });
    
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample) {
      self.refresh(sample.id);
    });
  },
  
  select: function(id) {
    this.selectedData = id;
    $('#moonrock-data-browser').itemBrowser('select', id);
  },
  
  refresh: function(sampleId) {
    var self = this;
    $('#moonrock-data-browser-throbber').itemBrowserThrobber("on");

    $.ajax({
      url: '?q=moonrock_data_input/' + MoonrockVmViewManager.getActivityId() + '/search',
      type: 'POST',
      dataType: 'json',
      data: {
        t: (new Date()).getTime(),
        nid: sampleId
      },
      success: function(data) {
        $('#moonrock-data-browser-throbber').itemBrowserThrobber("off");
        if (data.status) {
          $('#moonrock-data-browser').itemBrowser('setItems', data.items);
          $('#moonrock-data-browser').itemBrowser('select', self.selectedData);
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



