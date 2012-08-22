
var MoonrockSampleSearch = function(settings) {
  this.settings = $.extend({
    id : '',
    searchUrl : '',
    processForm : null
  }, settings);

  this.cluetip = settings.id;
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

  $(self.results).itemBrowser({
    clip: true,
    select: $(self.results).attr('select') === 'true',
    callback : function(event, itemId) {
      MoonrockSampleView.itemEvent(event, itemId);
    }
  });

  $(self.cluetip).cluetip({
    splitTitle: '|',
    showTitle: true,
    activation: 'click',
    sticky: true,
    closePosition: 'title',
    closeText: 'X',
    titleAttribute: 'tooltip-content',
    width: 380,
    onShow: function() {
      $(self.throbber).itemBrowserThrobber();

      $(self.form).find("input[type='text']").keypress(function(event) {
        if (event.keyCode === 13) {
          self.newSearch();
          event.stopPropagation();
          event.preventDefault();
        }
      });
      $(self.form).find("select").change(function() {
        self.newSearch();
      });

      $(self.form).deserialize(self.lastQuery);

      $(self.search).click(function() {
        self.newSearch(true);
      });
      $(self.cancel).click(function() {
        $(document).trigger('hideCluetip');
      });
    }
  });

  $(self.clear).click(function() {
    self.clearSearch();
  });
};

MoonrockSampleSearch.prototype.newSearch = function(hideForm) {
  var self = this;
  if (self.settings.processForm) {
    self.settings.processForm();
  }

  self.lastQuery = $(self.form).serialize();
  self.querySearch(hideForm);
};

MoonrockSampleSearch.prototype.querySearch = function(hideForm) {
  var self = this;

  $(self.throbber).itemBrowserThrobber("on");

  $.ajax({
    url: self.settings.searchUrl,
    dataType: 'json',
    data: self.lastQuery,
    success: function(data) {
      $(self.throbber).itemBrowserThrobber("off");

      if (hideForm) {
        $(document).trigger('hideCluetip');
      }

      if (data.status) {
        self.searchResults(data.items);
      }
    },
    error: function() {
      $(self.throbber).itemBrowserThrobber("off");
    }
  });
};

MoonrockSampleSearch.prototype.searchResults = function(items) {
  var self = this;
  if (items.length > 0) {
    $(self.clear).addClass('search-tooltip-link-active');
  } else {
    $(self.clear).removeClass('search-tooltip-link-active');
  }
  $(self.results).itemBrowser("setItems", items);
};

MoonrockSampleSearch.prototype.clearSearch = function() {
  var self = this;
  $(self.clear).removeClass('search-tooltip-link-active');
  $(self.results).itemBrowser("clear");
};

MoonrockSampleSearch.prototype.repeatSearch = function() {
  this.querySearch();
};

