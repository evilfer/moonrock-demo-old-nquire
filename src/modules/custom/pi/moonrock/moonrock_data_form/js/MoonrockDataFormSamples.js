


var MoonrockDataFormSamples = {
  searchManagers : null,
  currentItem : null,
  
  init : function() {
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
    
    $('.moonrock-snapshot-menu-item.moonrock-snapshot-menu-new').click(function() {
      var canvas = $(frames[0].document).find('#mic1canvas')[0];
      //      var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      var data = canvas.getContext('2d').getImageData(0, 0, 10, 10);
      return;
    });
    
    $("#moonrock-sample-main-list").html("");
    
    $("#moonrock-sample-main-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback
    }).itemBrowser("setItems", items);
    $("#moonrock-sample-mysnapshots-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback
    });
    $("#moonrock-sample-snapshotsbyothers-list").itemBrowser({
      eventCallback : eventCallback,
      metadataCallback : metadataCallback
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
    
    $('#moonrock-data-form-backtosearch').click(function() {
      MoonrockDataFormSamples._closeVM();
    });
    $('#moonrock-data-form-backtovm').click(function() {
      if ($(this).hasClass('moonrock-data-form-backtovm-enabled')) {
        MoonrockDataFormSamples._reopenVM();
      }
    });
    
    
    $('#moonrock-data-form-sample-previous').click(function() {
      MoonrockDataFormSamples._nextPrevItem('sample', -1);
    });
    $('#moonrock-data-form-sample-next').click(function() {
      MoonrockDataFormSamples._nextPrevItem('sample', 1);
    });
    $('#moonrock-data-form-snapshot-previous').click(function() {
      MoonrockDataFormSamples._nextPrevItem('snapshot', -1);
    });
    $('#moonrock-data-form-snapshot-next').click(function() {
      MoonrockDataFormSamples._nextPrevItem('snapshot', 1);
    });
  },
  
  _nextPrevItem: function(type, delta) {
    var item = type === 'sample' ? this._getSampleAround(delta) : this._getSnapshotAround(delta);
    if (item) {
      this._openVM(item);
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
    this._openVM(item);
    MoonrockDataFormData.itemAdded(item);
  },
  _itemRemoved: function() {
    this._checkNextPrevButtons();
  },
  _itemAdded: function() {
    this._checkNextPrevButtons();
  },
  
  openVM: function(item) {
    this._openVM(item);
  },
  
  _openVM: function(item) {
    this.currentItem = item;
    $('#moonrock-data-form-sample-title').html(item.sample_title);
    if (item.snapshot) {
      $('#moonrock-data-form-snapshot-title').html(item.snapshot_title).removeClass('moonrock-snapshot-no-value');
    } else {
      $('#moonrock-data-form-snapshot-title').html('&lt;no snapshot&gt;').addClass('moonrock-snapshot-no-value');
    }
    
    
    this._reopenVM();
    $('#moonrock-data-form-form').css('top', $('#moonrock-data-form-vm-container').position().top);
    
    $('#moonrock-data-form-vm-iframe').attr('src', item.vm);

    this._checkNextPrevButtons();
    
    MoonrockDataFormData.vmOpened(item);
  },
  
  _checkNextPrevButtons: function() {
    this._enableButton('#moonrock-data-form-sample-previous', this._getSampleAround(-1));
    this._enableButton('#moonrock-data-form-sample-next', this._getSampleAround(1));
    this._enableButton('#moonrock-data-form-snapshot-previous', this._getSnapshotAround(-1));
    this._enableButton('#moonrock-data-form-snapshot-next', this._getSnapshotAround(1));
  },
  
  _reopenVM: function() {
    $('#moonrock-data-form-search').addClass('moonrock-data-form-hidden');
    $('#moonrock-data-form-vmform').removeClass('moonrock-data-form-hidden');
  },
  
  _enableButton : function(id, enabled) {
    if (enabled) {
      $(id).addClass('moonrock-data-form-item-enabled');
    } else {
      $(id).removeClass('moonrock-data-form-item-enabled');
    }
  },
  
  _closeVM: function() {
    $('#moonrock-data-form-vmform').addClass('moonrock-data-form-hidden');
    $('#moonrock-data-form-search').removeClass('moonrock-data-form-hidden');
    $('#moonrock-sample-main-list').itemBrowser('update');
    $('#moonrock-sample-mysnapshots-list').itemBrowser('update');
    $('#moonrock-sample-snapshotsbyothers-list').itemBrowser('update');
    
    $('#moonrock-data-form-backtovm').addClass('moonrock-data-form-backtovm-enabled');
  },
  
  _getSampleAround: function(delta) {
    if (this.currentItem) {
      var pos = $('#moonrock-sample-main-list').itemBrowser('position', this.currentItem.sample) + delta;
      if (pos >= 0 && pos < $('#moonrock-sample-main-list').itemBrowser('countItems')) {
        return $('#moonrock-sample-main-list').itemBrowser('itemAt', pos);      
      }
    }
    return false;
  },
  _getSnapshotAround: function(delta) {
    if (this.currentItem) {
      var pos = 0;
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
  },
  
  
  
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
