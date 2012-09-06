
var MoonrockSampleSearch = function(settings) {
  this.settings = $.extend({
    id : '',
    searchUrl : '',
    processForm : null,
    metadataCallback: null
  }, settings);

  this.cluetip = '#' + settings.id;
  this.dlg = this.cluetip + '-dlg';
  this.form = this.cluetip + '-form';
  this.results = this.cluetip + '-results';
  this.throbber = this.cluetip + '-throbber';
  this.search = this.cluetip + '-search';
  this.cancel = this.cluetip + '-cancel';

  this.clear = this.cluetip + '-clear';

  this.lastQuery = '';

  this.init();
};

MoonrockSampleSearch.prototype.init = function() {
  var self = this;

  if ($(self.results).length > 0) {
    $(self.results).itemBrowser({
      clip: true,
      select: $(self.results).attr('select') === 'true',
      eventCallback : function(event, item, containerId) {
        MoonrockSampleView.itemEvent(event, item, containerId);
      },
      metadataCallback: self.settings.metadataCallback
    });

    $(self.dlg).dialog({
      autoOpen:false,
      width: 'auto',
      height: 'auto',
      minHeight: 100
    });

    $(self.throbber).itemBrowserThrobber();

    $(self.form).find("input[type='text']").keypress(function(event) {
      if (event.keyCode === 13) {
        self.newSearch();
        event.stopPropagation();
        event.preventDefault();
      }
    });
    $(self.form).find("input[type='checkbox']").change(function(event) {
      self.newSearch();
    });
    $(self.form).find("select").change(function() {
      self.newSearch();
    });

    $(self.search).click(function() {
      self.newSearch(true);
    });
    $(self.cancel).click(function() {
      $(self.dlg).dialog('close');
    });

    $(self.cluetip).click(function() {
      if ($(self.dlg).dialog('isOpen')) {
        $(self.dlg).dialog('moveToTop');
      } else {
        $(self.dlg).dialog('open');
      }
    });

    $(self.clear).click(function() {
      self.clearSearch();
    });

    self.newSearch(true);
  }
};

MoonrockSampleSearch.prototype.newSearch = function(hideForm) {
  var self = this;
  if (self.settings.processForm) {
    self.settings.processForm();
  }

  self.lastQuery = $(self.form).serialize();
  self._queryLastSearch(hideForm);
};

MoonrockSampleSearch.prototype._queryLastSearch = function(hideForm) {
  var self = this;

  self._querySearch(self.lastQuery, function(items) {
    if (items.length > 0) {
      $(self.clear).addClass('search-tooltip-link-active');
    } else {
      $(self.clear).removeClass('search-tooltip-link-active');
    }
    $(self.results).itemBrowser("setItems", items);

    if (hideForm) {
      $(self.dlg).dialog('close');
    }
  });
};

MoonrockSampleSearch.prototype._querySearch = function(query, callback) {
  var self = this;

  $(self.throbber).itemBrowserThrobber("on");

  $.ajax({
    url: self.settings.searchUrl,
    dataType: 'json',
    data: query,
    success: function(data) {
      $(self.throbber).itemBrowserThrobber("off");
      if (data.status) {
        callback(data.items);
      }
    },
    error: function() {
      $(self.throbber).itemBrowserThrobber("off");
    }
  });
};

MoonrockSampleSearch.prototype.clearSearch = function() {
  var self = this;
  $(self.clear).removeClass('search-tooltip-link-active');
  $(self.results).itemBrowser("clear");
};

MoonrockSampleSearch.prototype.repeatSearch = function() {
  this._queryLastSearch(false);
};



MoonrockSampleSearch.prototype.fetch = function(id) {
  var self = this;

  if ($(self.results).itemBrowser("hasItem", id)) {
    $(self.results).itemBrowser('clip', id);
  } else {
    self._querySearch({
      nid: id
    }, function(items) {
      if (items.length === 1) {
        $(self.clear).addClass('search-tooltip-link-active');
        $(self.results).itemBrowser("addItem", items[0]);
        $(self.results).itemBrowser('clip', id);
      }
    });
  }
};

