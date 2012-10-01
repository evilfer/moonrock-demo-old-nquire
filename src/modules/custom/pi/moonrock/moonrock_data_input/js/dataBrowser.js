

var MoonrockDataInputDataBrowser = {
  selectedSample: null,
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
    //alert('going to refresh');
    
    if (sampleId) {
      this.selectedSample = sampleId;
    }
    
    var self = this;
    $('#moonrock-data-browser-throbber').itemBrowserThrobber("on");

    $.ajax({
      url: '?q=moonrock_data_input/' + MoonrockVmViewManager.getActivityId() + '/search',
      type: 'POST',
      dataType: 'json',
      data: {
        t: (new Date()).getTime(),
        nid: self.selectedSample
      },
      success: function(data) {
        $('#moonrock-data-browser-throbber').itemBrowserThrobber("off");
        if (data.status) {
          $('#moonrock-data-browser').itemBrowser('setItems', data.items);
          if (self.selectedData || sampleId) {
            $('#moonrock-data-browser').itemBrowser('select', self.selectedData);
          }
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



