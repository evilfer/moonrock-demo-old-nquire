

var MoonrockVmViewManager = {
  currentItem: null,
  snapshotItem: null,
  browseItems: {
    prev: false,
    next: false
  },
  sampleSelectionCallbacks: [],
  vmLoadedCallbacks: [],
  
  
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
        console.log('vm from history');
        self._openVM();
      } else {
        console.log('browser from history');
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
  addVMLoadedCallback: function(callback) {
    this.vmLoadedCallbacks.push(callback);
  },
  
  _sampleSelected: function(item, sampleChanged) {
    if (item) {
      this.snapshotItem = this.currentItem;
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
    console.log('-update browser-');
    
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
    
    var self = this;
    this._resizeVMPage(function() {
      self._updateSampleBrowser();
    });
  },
  _resizeVMPage: function(callback) {
    console.log('-resize-');
    var element = $('#moonrock-samples-page-vm-top');
    var top = element.offset().top;
    var height = $(window).height();
    var pageblockHeight = height - top;
    element.css('height', pageblockHeight);
    console.log(pageblockHeight);
    
    var self = this;
    var next = function() {
      $('.moonrock-samples-page-vm-and-browser').css('height', pageblockHeight);
      var dataContainerHeight = $('.moonrock-data-browser-container').height();
      var vmPageHeight = pageblockHeight - dataContainerHeight - 20;
      $('#moonrock-samples-page-vm').css('height', vmPageHeight);
      var vmSampleBrowserHeight = $('#moonrock-samples-page-vm-sample').height();
      self._createVM();
      $('#moonrock-samples-page-vm-iframe-container').css('height', vmPageHeight - vmSampleBrowserHeight);
      $('#moonrock-samples-page-vm-iframe').css('height', vmPageHeight - vmSampleBrowserHeight);
      if (callback) {
        callback();
      }
    };
    
    this._destroyVM(next);
    
  },
  _destroyVM: function(callback) {
    console.log('-destroy-');
    var iframe = $('#moonrock-samples-page-vm-iframe');
    var self = this;
    if (iframe.length > 0) {
      MoonrockVMComm.getVMSnapshot(function(snapshot) {
        $('#moonrock-samples-page-vm-iframe').remove();
        MoonrockVmState.set(self.snapshotItem.id, snapshot);
        MoonrockSeeSamples.setSnapshot(self.snapshotItem.id, snapshot)
        
        if (callback) {
          callback();
        }
      });
    } else if (callback) {
      callback();
    }
  },
  _createVM: function() {
    console.log('-create-');
    this.snapshotItem = this.currentItem;
    var path = location.origin + location.pathname + this.currentItem.vm;
    $('#moonrock-samples-page-vm-iframe-container').append('<iframe id="moonrock-samples-page-vm-iframe" src="' + path + '"></iframe>');
    if (this.currentItem.snapshot) {
      var self = this;
      $('#moonrock-samples-page-vm-iframe').load(function() {
        setTimeout(function() {
          MoonrockVMComm.setVMParams(self.currentItem.snapshot.vm_parameters);
        }, 50);
      });
    }
  },

  
  _openBrowser: function() {
    this._destroyVM(function() {
      $('#moonrock-activity-description').show();
      $('#moonrock-samples-page-vm-top').addClass('moonrock-samples-page-hidden');
      $('#moonrock-samples-page-browse').removeClass('moonrock-samples-page-hidden');
    });
  }
};

$(function() {
  MoonrockVmViewManager.init();
});





