

var MoonrockSampleView = {
  searchManagers : null,

  init : function() {
    var items = [];
    $("#moonrock-sample-main-list").find("div").each(function() {
      var item = {
        id: $(this).attr("item-id"),
        title: $(this).attr("title"),
        img: $(this).attr("img")
      };
      items.push(item);
    });

    $("#moonrock-sample-main-list").html("").itemBrowser({
      select: $("#moonrock-sample-main-list").attr('select') === 'true',
      callback : function(event, itemId) {
        MoonrockSampleView.itemEvent(event, itemId);
      }
    }).itemBrowser("setItems", items);


    this.searchManagers = {
      sample: new MoonrockSampleSearch({
        id:'#moonrock-sample-search-samples',
        searchUrl : this.getBaseURL() + '/samplesearch'
      }),
      snapshot: new MoonrockSampleSearch({
        id : '#moonrock-sample-search-snapshots',
        searchUrl : this.getBaseURL() + '/snapshotsearch',
        processForm: function() {
          MoonrockSampleView.processSnapshotForm();
        }
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

  itemEvent: function(event, itemId) {
    switch (event) {
      case "imgclick":
        this._itemImageClicked(itemId);
        break;
      case "itemselected":
        this._itemSelected(itemId);
        break;
      case "itemremoved" :
        this._itemRemoved(itemId);
        break;
      default:
        break;
    }
  },
  _itemImageClicked: function(itemId) {
    MoonrockSampleDialog.open(itemId);
  },
  _itemSelected: function(itemId) {

  },
  _itemRemoved: function(itemId) {

  }
};
