


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
      $("<img/>").attr("src", item.img).addClass("item-browser-item-img").appendTo(imgcontainer);
      $("<div/>").addClass("item-browser-item-img-open").appendTo(imgcontainer);
      
      var title = $("<div/>").addClass("item-browser-item-title");
      $(title).html(item.title);

      if (options.metadataCallback) {
        var contentId = id + '-metadata-content';
        var content = $('<div style="display: none" id="' + contentId + '"/>');
        var cluetip = $('<div/>').addClass('item-browser-item-title-cluetip').attr('rel', '#' + contentId);
        var open = $('<div/>').addClass('item-browser-item-title-open');
        $(title).append(content);
        $(title).append(cluetip);
        $(title).append(open);

        var metadata = self.parent().itemBrowser('_getMetadata', self.data('item'));

        $(cluetip).qtip({
          content: {
            title: metadata.title,
            text: metadata.content
          },
          show: {
            delay: 0
          },
          hide: {
            fixed: true,
            delay: 200
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
              tooltip: 'moonrock-sample-tip'
            }
          }
        });
      }

      this.append(title);

      this.find('.item-browser-item-img-open,.item-browser-item-title-open').click(function() {
        $(this).parents('.item-browser-item').itemBrowserItem('_event', 'imgclick');
      });

      this.itemBrowserItem('_event', 'itemadded');

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
    update: function(item) {
      this.data('item', item)
      .attr("item-id", item.id)
      .find('.item-browser-item-title').html(item.title).end()
      .find('.item-browser-item-img').attr('src', item.img);
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


