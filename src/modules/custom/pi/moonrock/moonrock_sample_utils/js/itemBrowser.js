/**
 * Item browser container
 */

(function($) {

  var methods = {
    init : function(options) {
      var settings = $.extend({
        clip: false,
        select: false,
        callback: null
      }, options, {
        id: this.attr('id')
      });

      this.html("")
              .addClass("item-browser-container")
              .data('settings', settings);
      return this;
    },
    clear : function() {
      this.itemBrowser('setItems', []);
    },
    setItems : function(items) {
      var itemsToKeep = {};
      for (var i in items) {
        itemsToKeep[items[i].id] = true;
      }

      var currentIds = {};
      this.find(".item-browser-item").each(function() {
        var id = $(this).attr('item-id');
        if (itemsToKeep[id]) {
          currentIds[id] = true;
        } else {
          $(this).itemBrowserItem('remove');
        }
      });

      for (var i in items) {
        if (!currentIds[items[i].id]) {
          this.itemBrowser("addItem", items[i]);
        } else {
          this.find('.item-browser-item[item-id="' + items[i].id + '"]').itemBrowserItem('stay');
        }
      }
      return this;
    },
    getItemIds : function() {
      var ids = [];
      this.children().each(function() {
        ids.push($(this).attr("item-id"));
      });
      return ids;
    },
    addItem :  function(item) {
      var itemElement = $("<div />").itemBrowserItem(item, this.data('settings'));
      this.append(itemElement);
      return this;
    }
  };


  $.fn.itemBrowser = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.itemBrowser');
    }
  };
})(jQuery);


/**
 * Item browser item
 */

(function($) {
  var methods = {
    init : function(item, options) {
      this.addClass("item-browser-item")
              .attr("item-id", item.id);
      for (var attr in item.attrs) {
        this.attr(attr, item.attrs[attr]);
      }

      if (options.clip) {
        var header = $('<div/>')
                .addClass('item-browser-item-header');
        this.append(header);
        this.find('.item-browser-item-header').click(function() {
          $(this).parent().itemBrowserItem('_toogleClip');
        });
      }

      var img = $("<img/>")
              .attr("src", item.img)
              .addClass("item-browser-item-img");
/*      var title = $("<div/>");
      if (options.select) {
        var id = options.id + '-' + item.id;
        $(title).append($('<label/>').html(item.title).attr('for', id));
        $(title).append($(''))
      }*/
        
      var title = $("<div/>")
              .addClass("item-browser-item-title")
              .html(item.title);
              
      this.append(img).append(title);
      

      this.itemBrowserItem('stay').fadeIn('fast');
      this.data('settings', options);
      
      this.find('img').click(function() {
        $(this).parent().itemBrowserItem('_event', 'imgclick');
      });
      
      return this;
    },
    _event : function(type) {
      var callback = this.data('settings').callback;
      if (callback) {
        callback(type, this.attr('item-id'));
      }
    },
    _toogleClip: function() {
      if (this.find('.item-browser-item-header').hasClass('item-browser-item-header-clip')) {
        this.find('.item-browser-item-header-clip').removeClass('item-browser-item-header-clip');
        this.itemBrowserItem('_removeIfNeeded');
      } else {
        this.find('.item-browser-item-header').addClass('item-browser-item-header-clip');
      }
      return this;
    },
    stay: function() {
      this.data('wanted', true);
      return this;
    },
    remove : function() {
      this.data('wanted', false)
              .itemBrowserItem('_removeIfNeeded');
      return this;
    },
    _removeIfNeeded: function() {
      if (!this.data('wanted') && !this.find('.item-browser-item-header').hasClass('item-browser-item-header-clip')) {
        this.find().unbind('click');
        this.itemBrowserItem('_event', 'itemremoved');
        this.fadeOut('fast', function() {
          $(this).remove();
        });
      }
      return this;
    },
    _showTitle :function(show) {
      if (show) {
        this.find(".item-browser-item-title").show();
      } else {
        this.find(".item-browser-item-title").hide();
      }
      return this;
    }
  };

  $.fn.itemBrowserItem = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.itemBrowserItem');
    }
  };
})(jQuery);



(function($) {

  var methods = {
    init : function() {
      this.html("")
              .addClass("item-browser-throbber");
      return this;
    },
    on : function() {
      this.addClass("active");
      return this;
    },
    off :  function() {
      this.removeClass("active");
      return this;
    }
  };

  $.fn.itemBrowserThrobber = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.itemBrowser');
    }
  };
})(jQuery);