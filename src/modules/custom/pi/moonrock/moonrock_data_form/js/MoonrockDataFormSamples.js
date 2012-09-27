


var MoonrockDataFormSamples = {
  searchManagers : null,
  currentItem : null,
  
  init : function() {
    var useVM = $('#moonrock-data-form-search').attr('vm');
    
    var items = [];
    $("#moonrock-sample-main-list").find("div").each(function() {
      var itemdef = unescape($(this).html()).replace(/\\x26/g, "&").replace(/\\x3c/g, "<").replace(/\\x3e/g, ">");
      var item = JSON.parse(itemdef);
      items.push(item);
    });
    
    var metadataCallback = function(item) {
      return MoonrockDataFormSamples._formatItemMetadata(item);
    };
    var eventCallback = function(event, item, containerId) {
      MoonrockDataFormSamples.itemEvent(event, item, containerId);
    };
    
    $("#moonrock-sample-main-list").html("");
    
    $("#moonrock-sample-main-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback,
      useVM: useVM
    }).itemBrowser("setItems", items);
    $("#moonrock-sample-mysnapshots-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback,
      useVM: useVM
    });
    $("#moonrock-sample-snapshotsbyothers-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback,
      useVM: useVM
    });
    
    MoonrockVmState.get(function(data) {
      MoonrockDataFormSamples._setSampleSnapshots(data);
    });

    this.searchManagers = {
      mySnapshots : new MoonrockDataFormSearch({
        form: '#moonrock-sample-search-snapshots-form', 
        results: '#moonrock-sample-mysnapshots-list',
        throbber: '#moonrock-sample-mysnapshots-list-throbber', 
        additionalData: 'owner=me',
        searchUrl: this.getBaseURL() + '/snapshotsearch'
      }),
      otherSnapshots : new MoonrockDataFormSearch({
        form: '#moonrock-sample-search-snapshots-form', 
        results: '#moonrock-sample-snapshotsbyothers-list', 
        throbber: '#moonrock-sample-snapshotsbyothers-list-throbber', 
        additionalData: 'owner=others',
        searchUrl: this.getBaseURL() + '/snapshotsearch'
      })
    };
    
    
   
    $('#moonrock-data-form-vm-expand').click(function() {
      MoonrockDataFormSamples._expandVM();
    });
    $('#moonrock-data-form-vm-restore').click(function() {
      MoonrockDataFormSamples._restoreVM();
    });
    
    $('#moonrock-data-form-sample-previous').click(function() {
      MoonrockDataFormSamples._nextPrevItem(-1);
    });
    $('#moonrock-data-form-sample-next').click(function() {
      MoonrockDataFormSamples._nextPrevItem(1);
    });
    
    

    
    MoonrockDataFormHistory.enable(function(state) {
      MoonrockDataFormSamples.browserHistoryChange(state);
    });
    
    if (MoonrockDataFormData.sampleData()) {
      this.state = 'vm';
      this.openVM(MoonrockDataFormData.sampleData());
    } else {    
      this.state = 'search';
      this._openSearch();
    }
  },
  
  browserHistoryChange: function(vm) {
    if (vm) {
      this._openVM();
    } else {
      this._closeVM();
    }
  },
  
  _setSampleSnapshots: function(data) {
    for (var sample in data) {
      $("#moonrock-sample-main-list").itemBrowser('itemWidget', sample).itemBrowserItem('setSnapshot', data[sample]);
    }
    return;
  },
  _nextPrevItem: function(delta) {
    //    var item = type === 'sample' ? this._getSampleAround(delta) : this._getSnapshotAround(delta);
    var item = this._getSampleAround(delta);
    if (item) {
      this.openVM(item);
    }
  },
  
  getBaseURL : function() {
    var currentpath = window.location.search;
    var pos = currentpath.indexOf("activity/");
    var pos2 = currentpath.indexOf("/", pos + "activity/".length);
    if (pos >= 0 && pos2 >= 0) {
      return currentpath.substr(0, pos2);
    } else {
      return "?q=moonrock_sample_ajax";
    }
  },
  
  /**
   * Event callbacks
   */
  
  itemEvent: function(event, item, containerId) {
    switch (event) {
      case "imgclick":
        this._itemImageClicked(item);
        break;
      case "itemremoved":
        this._itemRemoved(item, containerId);
        break;
      case "itemadded":
        this._itemAdded(item, containerId);
        break;
      default:
        break;
    }
  },
  _itemImageClicked: function(item) {
    this.openVM(item);
  /*console.log('before assign: ' + window.history.length);
    window.location.assign('#');
    console.log('after assign: ' + window.history.length);*/
  },
  _itemRemoved: function() {
    this._checkNextPrevButtons();
  },
  _itemAdded: function(item) {
    this._checkNextPrevButtons();
  },
  
  reopenVM: function() {
    this.openVM();
  },
  
  openVM: function(item) {
    if (typeof(item) !== 'object') {
      item = $("#moonrock-sample-main-list").itemBrowser('getItem', item);
    }
    this.currentItem = item;
    MoonrockDataFormHistory.forward();
  },
  _expandVM: function() {
    $('#moonrock-data-form-vmform').addClass('moonrock-data-form-vmform-expanded');
  },
  _restoreVM: function() {
    $('#moonrock-data-form-vmform').removeClass('moonrock-data-form-vmform-expanded');
  },
  _openVM: function() {
    $('#moonrock-data-form-sample-title').html(this.currentItem.title);
    
    $('#moonrock-data-form-search').addClass('moonrock-data-form-hidden');
    $('#moonrock-data-form-vmform').removeClass('moonrock-data-form-hidden');

    $('#moonrock-activity-description').hide();
    $('#moonrock-data-form-form').css('padding-top', $('#moonrock-data-form-vm-container').position().top);
    if ($('#moonrock-data-form-block').length > 0) {
      $('#moonrock-data-form-vm-container').css('height', $('#moonrock-data-form-block').height());
    } else {
      $('#moonrock-data-form-vm-container').css('height', 680);
    }
    $('#moonrock-data-form-vm-iframe').remove();
    $('#moonrock-data-form-vm-container').append('<iframe id="moonrock-data-form-vm-iframe" src="' + this.currentItem.vm + '"></iframe>');
    //attr('src', this.currentItem.vm);
      
    this._checkNextPrevButtons();
    
    MoonrockDataFormData.vmOpened(this.currentItem);
    MoonrockDataFormSnapshooting.vmOpened(this.currentItem);
  },
  
  snapshotSubmitted: function(item) {
    this.currentItem = item;
    this.searchManagers.mySnapshots.update(item);
    $('#moonrock-data-form-sample-title').html(item.title);
    
    MoonrockDataFormData.vmOpened(item);
    MoonrockDataFormSnapshooting.vmOpened(item);
  },
  
  snapshotViewFilterModified: function() {
    this._closeVM();
    this.searchManagers.mySnapshots.newSearch();
    this.searchManagers.otherSnapshots.newSearch();    
  },
  
  _checkNextPrevButtons: function() {
    this._enableButton('#moonrock-data-form-sample-previous', this._getSampleAround(-1));
    this._enableButton('#moonrock-data-form-sample-next', this._getSampleAround(1));
  //this._enableButton('#moonrock-data-form-snapshot-previous', this._getSnapshotAround(-1));
  //this._enableButton('#moonrock-data-form-snapshot-next', this._getSnapshotAround(1));
  },
  
  _enableButton : function(id, enabled) {
    if (enabled) {
      $(id).addClass('moonrock-data-form-item-enabled');
    } else {
      $(id).removeClass('moonrock-data-form-item-enabled');
    }
  },
  
  _openSearch: function() {
    $('#moonrock-data-form-vmform').addClass('moonrock-data-form-hidden');
    $('#moonrock-data-form-search').removeClass('moonrock-data-form-hidden');
    $('#moonrock-sample-main-list').itemBrowser('update');
    $('#moonrock-sample-mysnapshots-list').itemBrowser('update');
    $('#moonrock-sample-snapshotsbyothers-list').itemBrowser('update');

    var searchFilter = $('#moonrock-data-form-search-filter');
    if (searchFilter.length > 0) {
      searchFilter.css('padding-top', $('#moonrock-sample-mysnapshots-list').position().top);
    }
  },
  
  _closeVM: function() {
    var self = this;
    
    MoonrockDataFormImage.getVMData(200, function(snapshot) {
      $('#moonrock-data-form-vm-iframe').remove();

      $('#moonrock-activity-description').show();
      self._openSearch();
      
      self._setSnapshot(self.currentItem.sample.nid, snapshot);
    });
  },
  _setSnapshot: function(sampleId, snapshot) {
    MoonrockVmState.set(sampleId, snapshot);
    $('#moonrock-sample-main-list').itemBrowser('itemWidget', sampleId).itemBrowserItem('setSnapshot', snapshot);
  },
  
  _getSampleAround: function(delta) {
    if (this.currentItem) {
      var pos = $('#moonrock-sample-main-list').itemBrowser('position', this.currentItem.sample.nid) + delta;
      if (pos >= 0 && pos < $('#moonrock-sample-main-list').itemBrowser('countItems')) {
        return $('#moonrock-sample-main-list').itemBrowser('itemAt', pos);      
      }
    }
    return false;
  },
  /*_getSnapshotAround: function(delta) {
    if (this.currentItem) {
      var pos = -1;
      var containers = [$('#moonrock-sample-mysnapshots-list'), $('#moonrock-sample-snapshotsbyothers-list')];
      var container = 0;
    
      for (var i = 0; i < containers.length; i++) {
        var p = containers[i].itemBrowser('position', this.currentItem.snapshot);
        if (p >= 0) {
          container = i;
          pos = p;
          break;
        }
      }
    
      var first = true;
      for (i = container; i >= 0 && i < containers.length; i += delta) {
        var n = containers[i].itemBrowser('countItems');
        for (var j = first ? pos + delta : (delta > 0 ? 0 : n-1); j >=0 && j < n; j += delta) {
          var item = containers[i].itemBrowser('itemAt', j);
          if (item.sample === this.currentItem.sample) {
            return item;
          }
        }
        first = false; 
      }
    }
    
    return false;
  },*/
  
  
  
  /*
   * Metadata callbacks
   */
  _formatMetadataTable: function(itemId, metadata) {
    var table = $('<table/>').addClass('moonrock-sample-tip-table');
    for (var key in metadata) {
      var tr = $('<tr/>').addClass('moonrock-sample-tip-row').appendTo(table);
      $('<td/>').addClass('moonrock-sample-tip-td moonrock-sample-tip-td-key').addClass('moonrock-sample-tip-td-key-' + key).html(metadata[key].title).appendTo(tr);
      $('<td/>').attr('id', 'sample-' + itemId + '-tip-value-' + key).addClass('moonrock-sample-tip-td moonrock-sample-tip-td-value').addClass('moonrock-sample-tip-td-value-' + key).html(metadata[key].value).appendTo(tr);
    }
    $(table).find('tr').filter(':odd').addClass("moonrock-sample-tip-row-odd");
    
    return table;
  },
  _formatItemMetadata : function(item) {
    var metadata = {
      title: item.title,
      content: this._formatMetadataTable(item.id, item.metadata)
    };

    return metadata;
  }
};
