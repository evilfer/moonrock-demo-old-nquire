


(function($) {
  var methods = {
    init : function(options) {
      var _options = $.extend({
        eventCallback: null,
        enableVmView: false
      }, options);
      
      var self = this;
      
      this.data('options', _options);
      this.data('item', {
        id: self.attr('item-id'),
        title: self.attr('item-title'),
        vm: self.attr('item-vm')
      });
      
      var imgcontainer = $("<div/>").addClass("vmSample-img-container").appendTo(this);
      $("<img/>").addClass("vmSample-img").appendTo(imgcontainer);
      
      if (self.attr('item-vm')) {
        $("<div/>").addClass("vmSample-img-open").appendTo(imgcontainer).click(function() {
          self.vmSample('_event', 'imgclick');
        });
      }
      this.vmSample('_setImage', 'sample');

      return this;
    },
    setSnapshot: function(snapshot) {
      if (this.data('options').enableVmView) {
        var item = this.data('item');
        item.snapshot = snapshot;
        this.data('item', item);
        this.vmSample('_enableImageToggle');
      }
      return this;
    },
    getSnapshot: function() {
      var item = this.data('item');
      return item.snapshot ? item.snapshot : false;
    },
    _enableImageToggle: function() {
      var self = this;
      if (self.find('.vmSample-img-toggle').length == 0) {
        self.find('.vmSample-img-container').append($("<div/>").addClass("vmSample-img-toggle"));
        self.find('.vmSample-img-toggle').click(function() {
          self.vmSample('_toggleImage');
        });
      }
      this.vmSample('_setImage', 'snapshot');
      return this;
    },
    _toggleImage: function() {
      this.vmSample('_setImage', this.data('item_image') === 'sample' ? 'snapshot' : 'sample');
      return this;
    },
    _setImage: function(type) {
      this.data('item_image', type);
      this.find('.vmSample-img').attr("src", type === 'sample' ? this.attr('item-image') : this.data('item').snapshot.image);
      return this;
    },
    getItem: function() {
      return this.data('item');
    },
    _event : function(type) {
      var options = this.data('options');
      if (options.eventCallback) {
        options.eventCallback(type, this.data('item'));
      }
      return this;
    }
  };

  $.fn.vmSample = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.vmSample');
      return FALSE;
    }
  };
})(jQuery);


