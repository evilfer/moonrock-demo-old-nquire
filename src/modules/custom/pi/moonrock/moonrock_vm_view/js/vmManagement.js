

var MoonrockVmViewManager = {
  currentItem: null,
  browseItems: {
    prev: false,
    next: false
  },
  sampleSelectionCallbacks: [],
  
  init: function() {
    var self = this;
    
    MoonrockSeeSamples.addCallback(function(type, item) {
      if (type === 'imgclick') {
        self.sampleSelected(item);
      }
    });
    
    MoonrockVmViewHistory.enable(function(vm) {
      if (vm) {
        self._openVM();
      } else {
        self._openBrowser();
      }
    })
    
    $('#moonrock-samples-page-vm-top-expand').click(function() {
      $('#moonrock-samples-page-vm-top').addClass('moonrock-samples-page-vm-top-expanded');
    });
    $('#moonrock-samples-page-vm-top-restore').click(function() {
      $('#moonrock-samples-page-vm-top').removeClass('moonrock-samples-page-vm-top-expanded');
    });
    
    $('#moonrock-samples-page-vm-sample-previous').click(function() {
      self.sampleSelected(self.browseItems.prev);
    });
    $('#moonrock-samples-page-vm-sample-next').click(function() {
      self.sampleSelected(self.browseItems.next);
    });
    
    self._openBrowser();
  },
  
  addSampleSelectionCallback: function(callback) {
    if (this.currentItem) {
      callback(this.currentItem);
    }
    
    this.sampleSelectionCallbacks.push(callback);
  },
  
  browserHistoryChange: function(vm) {
    if (vm) {
      this._openVM();
    } else {
      this._closeVM();
    }
  },
  
  sampleSelected: function(item) {
    if (item) {
      this.currentItem = item;
      MoonrockVmViewHistory.forward();
      for(var i in this.sampleSelectionCallbacks) {
        (this.sampleSelectionCallbacks[i])(this.currentItem);
      }
    }
  },
  
  _updateSampleBrowser: function() {
    var items = MoonrockSeeSamples.getItems();
    $('#moonrock-samples-page-vm-sample-title').html(this.currentItem.title);
    this.browseItems.prev = this.browseItems.next = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === this.currentItem.id) {
        this.browseItems.prev = i > 0 ? items[i-1] : false;
        this.browseItems.next = i < items.length - 1 ? items[i+1] : false;
        break;
      }
    }
    
    var f = function(id, enabled) {
      if (enabled) {
        $(id).addClass('moonrock-samples-page-vm-sample-enabled');
      } else {
        $(id).removeClass('moonrock-samples-page-vm-sample-enabled');
      }
    }
    
    f('#moonrock-samples-page-vm-sample-previous', this.browseItems.prev);
    f('#moonrock-samples-page-vm-sample-next', this.browseItems.next);
  },
  
  _openVM : function() {
    $('#moonrock-activity-description').hide();
    $('#moonrock-samples-page-browse').addClass('moonrock-samples-page-hidden');
    $('#moonrock-samples-page-vm-top').removeClass('moonrock-samples-page-hidden'); 
    
    $('#moonrock-samples-page-vm-iframe-container').css('height', 680);
    $('#moonrock-samples-page-vm-iframe').remove();
    $('#moonrock-samples-page-vm-iframe-container').append('<iframe id="moonrock-samples-page-vm-iframe" src="' + this.currentItem.vm + '"></iframe>');
    this._updateSampleBrowser();
  },
  
  _closeVM: function() {
    
  },
  
  _openBrowser: function() {
    $('#moonrock-activity-description').show();
    $('#moonrock-samples-page-vm-top').addClass('moonrock-samples-page-hidden');
    $('#moonrock-samples-page-browse').removeClass('moonrock-samples-page-hidden');
  }
};

$(function() {
  MoonrockVmViewManager.init();
});





