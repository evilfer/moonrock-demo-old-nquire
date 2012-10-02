

var MoonrockVmViewManager = {
  currentItem: null,
  browseItems: {
    prev: false,
    next: false
  },
  sampleSelectionCallbacks: [],
  
  init: function() {
    console.log('vmmanager');
    var self = this;
    
    MoonrockSeeSamples.addCallback(function(type, item) {
      if (type === 'imgclick') {
        self._sampleSelected(item, true);
      }
    });
    
    MoonrockVmViewHistory.enable(function(vm) {
      if (vm) {
        self._openVM();
      } else {
        self._openBrowser();
      }
    });
    
    $('#moonrock-samples-page-vm-top-expand').click(function() {
      $('#moonrock-samples-page-vm-top').addClass('moonrock-samples-page-vm-top-expanded');
      self._resizeVMPage();
    });
    $('#moonrock-samples-page-vm-top-restore').click(function() {
      $('#moonrock-samples-page-vm-top').removeClass('moonrock-samples-page-vm-top-expanded');
      self._resizeVMPage();
    });
    
    $('#moonrock-samples-page-vm-sample-previous').click(function() {
      self._sampleSelected(self.browseItems.prev, true);
    });
    $('#moonrock-samples-page-vm-sample-next').click(function() {
      self._sampleSelected(self.browseItems.next, true);
    });
    
    self._openBrowser();
  },
  
  openSample: function(sampleId) {
    var items = MoonrockSeeSamples.getItems();
    for (var i in items) {
      if (items[i].id === sampleId) {
        this._sampleSelected(items[i], false);
        break;
      }
    }
  },
  
  addSampleSelectionCallback: function(callback) {
    this.sampleSelectionCallbacks.push(callback);
  },
  
  browserHistoryChange: function(vm) {
    if (vm) {
      this._openVM();
    } else {
      this._closeVM();
    }
  },
  
  _sampleSelected: function(item, sampleChanged) {
    if (item) {
      this.currentItem = item;
      MoonrockVmViewHistory.forward();
      for(var i in this.sampleSelectionCallbacks) {
        (this.sampleSelectionCallbacks[i])(this.currentItem, sampleChanged);
      }
    }
  },
  
  getActivityId : function() {
    var currentpath = window.location.search;
    var pos = currentpath.indexOf("activity/");
    if (pos >= 0) {
      pos += "activity/".length;
      var pos2 = currentpath.indexOf("/", pos + 1);
      if (pos >= 0 && pos2 >= 0) {
        return currentpath.substr(pos, pos2 - pos);
      }
    }
    return "0";
    
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
    
    
    //$('#moonrock-samples-page-vm-iframe-container').css('height', 680);
    $('#moonrock-samples-page-vm-iframe').remove();
    $('#moonrock-samples-page-vm-iframe-container').append('<iframe id="moonrock-samples-page-vm-iframe" src="' + this.currentItem.vm + '"></iframe>');
    this._resizeVMPage();
    this._updateSampleBrowser();
  },
  _resizeVMPage: function() {
    var element = $('.moonrock-sample-utils-pageblock-page');
    var top = element.offset().top;
    var height = $(window).height();
    var pageblockHeight = height - top;
    element.css('height', pageblockHeight);
    console.log(pageblockHeight);
    
    $('#moonrock-samples-page-vm-iframe').remove();
    
    $('.moonrock-samples-page-vm-and-browser').css('height', pageblockHeight);
    
    var dataContainerHeight = $('.moonrock-data-browser-container').height();
    var vmPageHeight = pageblockHeight - dataContainerHeight - 20;
    $('#moonrock-samples-page-vm').css('height', vmPageHeight);
    
    
    var vmSampleBrowserHeight = $('#moonrock-samples-page-vm-sample').height();
    
    $('#moonrock-samples-page-vm-iframe-container').append('<iframe id="moonrock-samples-page-vm-iframe" src="' + this.currentItem.vm + '"></iframe>');
    $('#moonrock-samples-page-vm-iframe-container').css('height', vmPageHeight - vmSampleBrowserHeight);
    $('#moonrock-samples-page-vm-iframe').css('height', vmPageHeight - vmSampleBrowserHeight);
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





