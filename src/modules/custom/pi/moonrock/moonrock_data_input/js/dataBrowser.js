

var MoonrockDataInputDataBrowser = {
  selectedSample: null,
  selectedData: null,
  
  init: function() {
    var self = this;
    $('#moonrock-data-browser').itemBrowser({
      eventCallback: function(type, item) {
        if (type === 'imgclick') {
          MoonrockDataInput.setItem(item);
        } else if (type === 'itemadded') {
          MoonrockDataInput.itemAdded(item);
        }
      },
      imageLink: true
    });
    
    VmManager.addSampleSelectionCallback(function(sample) {
      self.refresh(sample.id);
    });
  },
  
  select: function(id) {
    this.selectedData = id;
    $('#moonrock-data-browser').itemBrowser('select', id);
  },
  
  refresh: function(sampleId) {
    if (sampleId) {
      this.selectedSample = sampleId;
    }
    
    var self = this;
    $('#moonrock-data-browser-throbber').itemBrowserThrobber("on");

    $.ajax({
      url: '?q=moonrock_data_input/' + VmManager.getActivityId() + '/search',
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
  },
  updateItem: function(item) {
    $('#moonrock-data-browser').itemBrowser('updateItem', item);
  },
  removeItem: function(itemId) {
    $('#moonrock-data-browser').itemBrowser('removeItem', itemId);
  },
  
  repaint: function() {
    var items = [];
    var selected = null;
    $('#moonrock-data-browser').find('.item-browser-item').each(function() {
      var item = $(this).data('item');
      items.push(item);
      if ($(this).hasClass('item-browser-item-selected')) {
        selected = item.id;
      }
    });
    
    $('#moonrock-data-browser').itemBrowser('setItems', []);
    $('#moonrock-data-browser').itemBrowser('setItems', items);
    if (selected) {
      $('#moonrock-data-browser').itemBrowser('select', selected);
    }
  },
  
  getItem: function(itemId) {
    return $('#moonrock-data-browser').itemBrowser('getItem', itemId);
  }
};

$(function() {
  MoonrockModules.register('MoonrockDataInputDataBrowser', MoonrockDataInputDataBrowser); 
});



