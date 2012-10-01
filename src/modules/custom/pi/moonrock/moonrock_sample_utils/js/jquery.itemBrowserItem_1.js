


(function($) {
  var methods = {
    init : function(item, options) {
      var self = this;

      this.data('item', item);
      var id = options.id + '-' + item.id;

      this.addClass("item-browser-item")
      .attr('id', id)
      .attr("item-id", item.id)
      .css('width', options.itemWidth + 'px');
      for (var attr in item.attrs) {
        this.attr(attr, item.attrs[attr]);
      }

      var imgcontainer = $("<div/>").addClass("item-browser-item-img-container").appendTo(this);
      
      var image = $("<img/>").addClass("item-browser-item-img").appendTo(imgcontainer).css('display', 'none');
      image[0].onload = function() {
        self.parent().itemBrowser('_updateHeight');
        image.css('display', 'block').fadeIn();
      };
      image.attr("src", item.image + '?t=' + (new Date()).getTime());
      
      if (options.imageLink) {
        $("<div/>").addClass("item-browser-item-img-open").appendTo(imgcontainer).mousedown(function() {
          self.data('clickvalid', true);
        }).mouseup(function() {
          if (self.data('clickvalid')) {
            $(this).parents('.item-browser-item').itemBrowserItem('_event', 'imgclick');
          }
        });
        
        $(document).mousemove(function() {
          self.data('clickvalid', false);
        });
      }
      //this.itemBrowserItem('_setImage', item.snapshot ? 'snapshot' : 'sample');
      
      if (options.createTitle) {
        var title = $("<div/>").addClass("item-browser-item-title");
        $(title).html(item.title);
        this.append(title);
      }
      
      this.itemBrowserItem('_setMetadata', item);

      this.itemBrowserItem('_event', 'itemadded');

      return this;
    },
    _setMetadata: function(item) {
      if (item.metadata) {
        var imgcontainer = this.find('.item-browser-item-img-container');
        $(imgcontainer).qtip({
          content: {
            title: item.metadata.title,
            text: item.metadata.content
          },
          show: {
            delay: 0
          },
          hide: {
            fixed: true,
            delay: 0
          },
          position: {
            corner: {
              target: 'topRight',
              tooltip: 'bottomLeft'
            },
            adjust: {
              screen: true,
              scroll: true
            }
          },
          style: {
            classes: {
              tooltip: 'item-browser-item-qtip'
            }
          }
        });
      }      
    },
    imageHeightRatio: function() {
      var img = this.find('.item-browser-item-img')[0];
      return img.naturalHeight / img.naturalWidth;
    },
    setSnapshot: function(snapshot) {
      var item = this.data('item');
      item.snapshot = snapshot;
      this.data('item', item);
      this.itemBrowserItem('_enableImageToggle');
      return this;
    },
    _enableImageToggle: function() {
      var self = this;
      if (self.find('.item-browser-item-img-toggle').length == 0) {
        self.find('.item-browser-item-img-container').append($("<div/>").addClass("item-browser-item-img-toggle"));
        self.find('.item-browser-item-img-toggle').click(function() {
          self.itemBrowserItem('_toggleImage');
        });
      }
      this.itemBrowserItem('_setImage', 'snapshot');
      return this;
    },
    _toggleImage: function() {
      this.itemBrowserItem('_setImage', this.data('item_image') === 'sample' ? 'snapshot' : 'sample');
      return this;
    },
    _setImage: function(type) {
      var item = this.data('item');
      this.data('item_image', type);
      this.find('.item-browser-item-img').attr("src", item[type].image);
      return this;
    },
    playAppearAnimation : function() {
      this.css('opacity', 0);
      this.animate({
        opacity: 1
      }, 'fast');
      return this;
    },
    showInfo: function(show) {
      if (show) {
        this.find('.item-browser-item-title').css('width', 'auto');
        this.find('.item-browser-item-header').show();
      } else {
        this.find('.item-browser-item-title').css('width', '0px');
        this.find('.item-browser-item-header').hide();
      }
    },
    getItem: function() {
      return this.data('item');
    },
    _event : function(type) {
      this.parent().itemBrowser('_event', type, this.data('item'));
      return this;
    },
    remove : function(callback) {
      this.find().unbind('click');
      this.itemBrowserItem('_event', 'itemremoved');
      this.fadeOut('fast', function() {
        $(this).remove();
        if (callback) {
          callback();
        }
      });
    },
    setNew: function(isNew) {
      this.itemBrowserItem('_setClass', 'item-browser-item-new', isNew);
      return this;
    },
    setSelected: function(selected) {
      this.itemBrowserItem('_setClass', 'item-browser-item-selected', selected)
      .itemBrowserItem('setNew', false);
      return this;
    },
    _setClass: function(className, hasIt) {
      if (hasIt) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return this;
    },
    update: function(item) {
      this.data('item', item).attr("item-id", item.id);
      this.find('.item-browser-item-title').html(item.title);
      this.find('.item-browser-item-img').attr('src', item.image + '?' + new Date().getTime());
      this.itemBrowserItem('_setMetadata', item);
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


