

var MoonrockSampleView = {
  searchManagers : null,

  init : function() {
    var items = [];
    $("#moonrock-sample-main-list").find("div").each(function() {
      var itemdef = unescape($(this).attr('item-def')).replace(/\\x26/g, "&").replace(/\\x3c/g, "<").replace(/\\x3e/g, ">");
      var item = JSON.parse(itemdef);
      items.push(item);
    });

    var metadataCallback = function(item) {
      return MoonrockSampleView._formatItemMetadata(item);
    };

    $("#moonrock-sample-main-list").html("").itemBrowser({
      select: $("#moonrock-sample-main-list").attr('select') === 'true',
      eventCallback : function(event, item, containerId) {
        MoonrockSampleView.itemEvent(event, item, containerId);
      },
      metadataCallback : metadataCallback
    }).itemBrowser("setItems", items);


    this.searchManagers = {
      sample: new MoonrockSampleSearch({
        id:'moonrock-sample-search-samples',
        searchUrl : this.getBaseURL() + '/samplesearch',
        metadataCallback : metadataCallback
      }),
      snapshot: new MoonrockSampleSearch({
        id : 'moonrock-sample-search-snapshots',
        searchUrl : this.getBaseURL() + '/snapshotsearch',
        processForm: function() {
          MoonrockSampleView.processSnapshotForm();
        },
        metadataCallback : metadataCallback
      })
    };
    
    $('#moonrock-sample-search-snapshots-view-clear').click(function() {
      MoonrockSampleView.clearSearchSnapshotByView();
    });
    
    if (typeof(MoonrockSampleSelection) !== 'undefined') {
      if (MoonrockSampleSelection.sample && !$('#moonrock-sample-main-list').itemBrowser('hasItem', MoonrockSampleSelection.sample)) {
        this.searchManagers.sample.fetch(MoonrockSampleSelection.sample);
      }
      if (MoonrockSampleSelection.snapshot) {
        this.searchManagers.snapshot.fetch(MoonrockSampleSelection.snapshot);
      }
    }
  },

  /**
 * Common functions
 */
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
  
  searchSnapshotByView: function(sample, vmParameters) {
    
    $('input[name="useanysampleref"], input[name="usemainsample"], select[name="usesamplerefs"]').attr('disabled', 'disabled');
    
    $('#moonrock-sample-search-snapshots-view-noview').hide();
    $('#moonrock-sample-search-snapshots-view-view').show();
    
    var img = $('.item-browser-item[item-id="' + sample.id + '"]').find('.item-browser-item-img').attr('src');
    $('#moonrock-sample-search-snapshots-view-img').attr('src', img);
    $('#moonrock-sample-search-snapshots-view-sample').html(sample.name);
    $('input[name="useviewsample"]').attr('value', sample.id);
    $('input[name="useviewparameters"]').attr('value', vmParameters);
    $('#moonrock-sample-search-snapshots-dlg').dialog('open');
    
    $('#moonrock-sample-search-snapshots-view-view').find('.item-browser-item-title-open').unbind('click').click(function() {
      MoonrockSampleView._itemImageClicked($('input[name="useviewsample"]').attr('value'));
    });
    this.searchManagers.snapshot.newSearch();
  },
  
  clearSearchSnapshotByView: function() {
    $('input[name="useanysampleref"], input[name="usemainsample"], select[name="usesamplerefs"]').removeAttr('disabled', 'enabled');

    $('#moonrock-sample-search-snapshots-view-view').hide();
    $('#moonrock-sample-search-snapshots-view-noview').show();

    $('input[name="useviewsample"]').attr('value', '');
    $('input[name="useviewparameters"]').attr('value', '');
    
    this.searchManagers.snapshot.newSearch();
  },


  processSnapshotForm: function() {
    if ($('input[name="useanysampleref"]').length > 0) {
      var any = $('input[name="useanysampleref"]').attr('checked');
      $('#moonrock-sample-search-snapshots-usesamplerefs').attr('value', any ? 0 : 1);
    }
      
    if ($('#moonrock-sample-search-snapshots-usesamplerefs').attr('value')) {
      var samples = null;
      if ($('input[name="usemainsample"]').length > 0) {
        samples = [];
        $('input[name="usemainsample"]').each(function() {
          if ($(this).attr('checked')) {
            samples.push($(this).attr('value'));
          }
        });
      }else {
        samples = $('#moonrock-sample-search-samples-results').itemBrowser('getItemIds')
        .concat($('#moonrock-sample-main-list').itemBrowser('getItemIds'));
      }
      $('#moonrock-sample-search-snapshots-samplerefs').attr('value', samples.join(' '));
    }
  },
  
  newSnapshot: function(snapshot) {
    this.searchManagers.snapshot.fetch(snapshot.nid);
  },
  /**
   * sample event callbacks
   * 
   * Possible containers:
   * - moonrock-sample-main-list
   * - moonrock-sample-search-samples-results
   * - moonrock-sample-search-snapshots-results   
   */

  itemEvent: function(event, item, containerId) {
    switch (event) {
      case "imgclick":
        this._itemImageClicked(item.id);
        break;
      case "itemselected":
        this._itemSelected(item, containerId);
        break;
      case "itemremoved":
        this._itemRemoved(item, containerId);
        break;
      case "itemunselected":
        this._itemUnselected(item, containerId);
        break;
      case "itemadded":
        this._itemAdded(item, containerId);
        break;
      default:
        break;
    }
  },
  _itemImageClicked: function(itemId) {
    MoonrockSampleDialog.open(itemId);
  },
  _itemSelected: function(item, containerId) {
    MoonrockSampleSelection.select(item);

    if (containerId === 'moonrock-sample-search-snapshots-results') {
      var mainSampleShown = $('#moonrock-sample-main-list').itemBrowser('select', item.params.sampleref);
      var searchSampleShown = $('#moonrock-sample-search-samples-results').itemBrowser('select', item.params.sampleref);

      if (!mainSampleShown && !searchSampleShown) {
        this.searchManagers.sample.fetch(item.params.sampleref);
      }
    } else {

      var snapshot = $('#moonrock-sample-search-snapshots-results').itemBrowser('selectedItem');
      if (snapshot && snapshot.params.sample_ref !== item.id) {
        $('#moonrock-sample-search-snapshots-results').itemBrowser('clearSelection');
      }

      var other = containerId === 'moonrock-sample-main-list' ? '#moonrock-sample-search-samples-results' : '#moonrock-sample-main-list';
      $(other).itemBrowser('select', item.id);
    }
  },
  _itemUnselected: function(item, containerId) {
    if (containerId === 'moonrock-sample-search-snapshots-results') {
      MoonrockSampleSelection.unselectSnapshot();
    } else {
      MoonrockSampleSelection.unselectSample();

      $('#moonrock-sample-search-snapshots-results').itemBrowser('clearSelection');

      var other = containerId === 'moonrock-sample-main-list' ? '#moonrock-sample-search-samples-results' : '#moonrock-sample-main-list';
      $(other).itemBrowser('clearSelection');
    }
  },
  _itemRemoved: function(item, containerId) {

  },
  _itemAdded: function(item, containerId) {
    if (typeof (MoonrockSampleSelection) !== 'undefined') {
      if (item.id === MoonrockSampleSelection.sample || item.id === MoonrockSampleSelection.snapshot) {
        $('#' + containerId).itemBrowser('select', item.id);
      }
    }
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
