
var MoonrockDataFormSearch = function(settings) {
  this.settings = settings;
  this.lastQuery = '';
  this.init();
};

MoonrockDataFormSearch.prototype.init = function() {
  var self = this;
  
  if ($(self.settings.results).length > 0) {
    $(self.settings.throbber).itemBrowserThrobber();

    $(self.settings.form).find("input[type='text']").keypress(function(event) {
      if (event.keyCode === 13) {
        self.newSearch();
        event.stopPropagation();
        event.preventDefault();
      }
    });
    $(self.settings.form).find("input[type='checkbox']").change(function(event) {
      self.newSearch();
    });
    $(self.settings.form).find("select").change(function() {
      self.newSearch();
    });

    self.newSearch();
  }
};

MoonrockDataFormSearch.prototype.newSearch = function() {
  this.lastQuery = $(this.settings.form).serialize();
  if (this.settings.additionalData) {
    if (this.lastQuery.length > 0) {
      this.lastQuery += '&';
    }
    this.lastQuery += this.settings.additionalData; 
  }
  this._queryLastSearch();
};

MoonrockDataFormSearch.prototype._queryLastSearch = function() {
  var self = this;

  self._querySearch(self.lastQuery + '&time=' + new Date().getTime(), function(items) {
    $(self.settings.results).itemBrowser("setItems", items);
  });
};

MoonrockDataFormSearch.prototype._querySearch = function(query, callback) {
  var self = this;

  $(self.settings.throbber).itemBrowserThrobber("on");

  $.ajax({
    url: self.settings.searchUrl,
    dataType: 'json',
    data: query,
    success: function(data) {
      $(self.settings.throbber).itemBrowserThrobber("off");
      if (data.status) {
        callback(data.items);
      }
    },
    error: function() {
      $(self.settings.throbber).itemBrowserThrobber("off");
    }
  });
};

MoonrockDataFormSearch.prototype.clearSearch = function() {
  var self = this;
  $(self.settings.results).itemBrowser("clear");
};

MoonrockDataFormSearch.prototype.repeatSearch = function() {
  this._queryLastSearch();
};

MoonrockDataFormSearch.prototype.update = function(item) {
  var self = this;
  
  if ($(self.settings.results).itemBrowser('hasItem', item.id)) {
    $(self.settings.results).itemBrowser('updateItem', item);
  } else {
    this._querySearch({
      nid: item.id,
      time: new Date().getTime()
    }, function(items) {
      $(self.settings.results).itemBrowser('appendItems', items);
    });
  }
}




MoonrockDataFormSearch.prototype.fetch = function(id) {
  var self = this;

  if (!$(self.settings.results).itemBrowser("hasItem", id)) {
    self._querySearch({
      nid: id,
      time: new Date().getTime()
    }, function(items) {
      $(self.settings.results).itemBrowser("setItems", items);
    });
  }
};
