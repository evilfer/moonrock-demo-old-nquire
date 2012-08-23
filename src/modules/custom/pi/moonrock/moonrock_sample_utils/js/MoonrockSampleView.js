

var MoonrockSampleView = {
  searchManagers : null,

  init : function() {
    var items = [];
    $("#moonrock-sample-main-list").find("div").each(function() {
      var item = JSON.parse($(this).attr('item-def'));
      items.push(item);
    });

    var metadataCallback = function(item) {
      return MoonrockSampleView._formatItemMetadata(item);
    };

    $("#moonrock-sample-main-list").html("").itemBrowser({
      select: $("#moonrock-sample-main-list").attr('select') === 'true',
      callback : function(event, item, containerId) {
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



  processSnapshotForm: function() {
    if ($('#moonrock-sample-search-snapshots-usesamplerefs').attr('value')) {
      var samplerefs = $('#moonrock-sample-search-samples-results').itemBrowser('getItemIds')
              .concat($('#moonrock-sample-main-list').itemBrowser('getItemIds'));
      $('#moonrock-sample-search-snapshots-samplerefs').attr('value', samplerefs.join(' '));
    }
  },
  /**
   * sample event callbacks
   */

  itemEvent: function(event, item, containerId) {
    switch (event) {
      case "imgclick":
        this._itemImageClicked(item, containerId);
        break;
      case "itemselected":
        this._itemSelected(item, containerId);
        break;
      case "itemremoved" :
        this._itemRemoved(item, containerId);
        break;
      default:
        break;
    }
  },
  _itemImageClicked: function(item, containerId) {
    MoonrockSampleDialog.open(item.id);
  },
  _itemSelected: function(itemId, containerId) {

  },
  _itemRemoved: function(itemId, containerId) {

  },


  /*
   * Metadata callbacks
   */
   _formatMetadataTable: function(metadata) {
     var table = $('<table/>');
     for (var key in metadata) {
       var tr = $('<tr/>').appendTo(table);
       $('<td/>').html(metadata[key].title).appendTo(tr);
       $('<td/>').html(metadata[key].value).appendTo(tr);
     }
     return table;
   },
  _formatItemMetadata : function(item) {
    var metadata = {
      title: item.title,
      content: this._formatMetadataTable(item.metadata)
    };

    return metadata;
  }
};
