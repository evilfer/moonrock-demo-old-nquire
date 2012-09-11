


var MoonrockDataFormSamples = {
  searchManagers : null,
  currentItem : null,

  init : function() {
    var items = [];
    $("#moonrock-sample-main-list").find("div").each(function() {
      var itemdef = unescape($(this).attr('item-def')).replace(/\\x26/g, "&").replace(/\\x3c/g, "<").replace(/\\x3e/g, ">");
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
    
    $('#moonrock-data-form-back').click(function() {
      MoonrockDataFormSamples._closeVM();
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
    var item = type === 'sample' ? this._getSampleAround(delta) : this._getSampleAround(delta);
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
  },
  _itemRemoved: function() {
  },
  _itemAdded: function() {
  },
  
  _openVM: function(item) {
    this.currentItem = item;
    $('#moonrock-data-form-sample-title').html(item.sample_title);
    $('#moonrock-data-form-snapshot-title').html(item.snapshot ? item.snapshot_title : '');
    
    $('#moonrock-data-form-search').addClass('moonrock-data-form-hidden');
    $('#moonrock-data-form-vmform').removeClass('moonrock-data-form-hidden');
    
    
    this._enableButton('#moonrock-data-form-sample-previous', this._hasSampleAround(-1));
    this._enableButton('#moonrock-data-form-sample-next', this._hasSampleAround(1));
    this._enableButton('#moonrock-data-form-snapshot-previous', this._hasSampleAround(-1));
    this._enableButton('#moonrock-data-form-snapshot-next', this._hasSampleAround(1));
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
  },
  
  _hasSampleAround: function(delta) {
    var pos = $('#moonrock-sample-main-list').itemBrowser('position', this.currentItem.sample) + delta;
    return pos >= 0 && pos < $('#moonrock-sample-main-list').itemBrowser('countItems');
  },
  _getSampleAround: function(delta) {
    var pos = $('#moonrock-sample-main-list').itemBrowser('position', this.currentItem.sample) + delta;
    return $('#moonrock-sample-main-list').itemBrowser('itemAt', pos);
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

$(function() {
  MoonrockDataFormSamples.init();
})