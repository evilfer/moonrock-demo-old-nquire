/**
 * Item browser container
 */

(function($) {

  var methods = {
    init : function(options) {
      var settings = $.extend({
        clip: false,
        select: false,
        eventCallback: null,
        metadataCallback: null,
        itemWidth: 200,
        itemMargin: 20,
        taperingPortion: .2
      }, options, {
        id: this.attr('id')
      });

      this.html("")
              .addClass("item-browser-container")
              .data('settings', settings)
              .data('selected', null)
              .data('scroll', 0)
              .data('scrolling', false)
              .data('scrollingPageX', 0);

      var scrollContainer = $('<div/>').addClass("item-browser-scroll-container").appendTo(this);
      $('<div/>').addClass('item-browser-scroll-bar').appendTo(scrollContainer);

      var self = this;
      this.find('.item-browser-scroll-bar').css('left', 0);

      this.find('.item-browser-scroll-bar').mousedown(function(event) {
        self.data('scrolling', true);
        self.data('scrollPositionInHandle', event.pageX - self.find('.item-browser-scroll-bar').position().left);
        $('body').disableSelection();
      });
      $(document).mouseup(function() {
        self.data('scrolling', false);
        $('body').enableSelection();
      });
      $(document).mousemove(function(event) {
        if (self.data('scrolling')) {
          var scrollWidth = self.width() - self.find('.item-browser-scroll-bar').width();
          var currentPos = self.find('.item-browser-scroll-bar').position().left;
          var newPos = Math.max(0, Math.min(scrollWidth, event.pageX - self.data('scrollPositionInHandle')));
          if (newPos !== currentPos) {
            self.find('.item-browser-scroll-bar').css('left', newPos);
            self.data('scroll', newPos / scrollWidth);
            self.data('scrollingPageX', event.pageX);
            self.itemBrowser('_updatePositions');
          }
          event.stopPropagation();
          event.preventDefault();
        }
      });


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
      var itemsToRemove = [];
      this.find(".item-browser-item").each(function() {
        var id = $(this).attr('item-id');
        if (itemsToKeep[id]) {
          currentIds[id] = true;
        } else {
          itemsToRemove.push(this);
        }
      });
      var count = itemsToRemove.length;
      var self = this;

      var afterRemove = function() {
        var added = [];
        for (var i in items) {
          if (!currentIds[items[i].id]) {
            self.itemBrowser("_addItem", items[i]);
            added.push(items[i].id);
          } else {
            self.find('.item-browser-item[item-id="' + items[i].id + '"]').itemBrowserItem('stay');
          }
        }
        self.itemBrowser('_updatePositionsAnimate');
        /*        for (var i in added) {
          self.find('.item-browser-item[item-id="' + added[i] + '"]').itemBrowserItem('playAppearAnimation');
        }*/
      };

      if (count === 0) {
        afterRemove();
      } else {
        var oneRemoved = function() {
          count--;
          if (count === 0) {
            afterRemove();
          }
        };

        for (var i in itemsToRemove) {
          $(itemsToRemove[i]).itemBrowserItem('remove', oneRemoved);
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
      if ($(this).find('.item-browser-item[item-id="' + item.id + '"]').length === 0) {
        this.itemBrowser('_addItem', item);
        this.itemBrowser('_updatePositionsAnimate');
      }
      return this;
    },
    _addItem: function(item) {
      $("<div />").appendTo(this).itemBrowserItem(item, this.data('settings'));
      return this;
    },
    _event: function(type, item) {
      if (type === 'itemselected') {
        this.data('selected', item);
        this.find('.item-browser-item[item-id!="' + item.id + '"]').itemBrowserItem('unselect');
      } else if (type === 'itemunselected') {
        this.data('selected', null);
      }

      console.log(type + " - " + this.data('settings').id + " - " + item.id);

      var settings = this.data('settings');
      if (settings.eventCallback) {
        settings.eventCallback(type, item, settings.id);
      }
    },
    clearSelection: function(itemId) {
      this.find('.item-browser-item').itemBrowserItem('unselect');
      this.data('selected', null);
      return this;
    },
    _getMetadata: function(item) {
      var metadata = this.data('settings').metadataCallback(item, this.data('settings').id);
      return metadata;
    },
    selectedItem: function() {
      return this.data('selected');
    },
    hasItem: function(itemId) {
      return this.find('.item-browser-item[item-id="' + itemId + '"]').length > 0;
    },
    select: function(itemId) {
      this.find('.item-browser-item[item-id!="' + itemId + '"]').itemBrowserItem('unselect');
      var selection = this.find('.item-browser-item[item-id="' + itemId + '"]').itemBrowserItem('select').itemBrowserItem('getItem');
      this.data('selected', typeof(selection) === 'undefined' ? null : selection);
      return this.itemBrowser('hasItem', itemId);
    },
    clip: function(itemId) {
      this.find('.item-browser-item[item-id="' + itemId + '"]').itemBrowserItem('_clip');
      return this;
    },

    _calculatePositions: function() {
      var positions = [];

      var width = this.width();
      var itemWidth = this.data('settings').itemWidth;
      var itemMargin = this.data('settings').itemMargin;
      var items = this.find('.item-browser-item');
      var itemCount = items.length;

      var neededWidth = itemWidth * itemCount + (itemCount - 1) * itemMargin;
      var useScroll = neededWidth > width;



      if (useScroll) {
        var scrollPosition = this.data('scroll');
        var taperingPortion = this.data('settings').taperingPortion;
        var realTapered = width * taperingPortion;
        var realLeftTapered = scrollPosition * realTapered;
        var realRightTapered = (1 - scrollPosition) * realTapered;
        var untapered = width - realTapered;

        var neededTapered = neededWidth - untapered;
        var neededLeftTapered = scrollPosition * neededTapered;
        var neededRightTapered = (1 - scrollPosition) * neededTapered;

        var curve = function(xn, nw, rw) {
          var e = nw / rw;
          var k = rw / Math.pow(nw, e);
          return k * Math.pow(Math.max(0, xn), e);
        };
        var realPos = function(x) {
          if (x < neededLeftTapered) {
            return curve(x, neededLeftTapered, realLeftTapered);
          } else if (x <= neededLeftTapered + untapered) {
            return x - neededLeftTapered + realLeftTapered;
          } else {
            var inverseXn = neededWidth - x;
            var inverseXr = curve(inverseXn, neededRightTapered, realRightTapered);
            return width - inverseXr;
          }
        };

        var x = 0;
        items.each(function() {
          var x0 = realPos(x);
          var x1 = realPos(x + itemWidth);
          var w = x1 - x0;
          x += itemWidth + itemMargin;

          positions.push({
            element: this,
            oldx: $(this).position().left,
            oldw : $(this).width(),
            newx: x0,
            neww: Math.max(.2, w),
            showdata: w > .5 * itemWidth
          });
        });
      } else {
        var x0 = .5 * (width - neededWidth);
        
        items.each(function() {
          positions.push({
            element: this,
            oldx: $(this).position().left,
            oldw : $(this).width(),
            newx: x0,
            neww: itemWidth,
            showdata: true
          });
          x0 += itemWidth + itemMargin;
        });

      }
      return {
        scroll: {
          active: useScroll,
          width: useScroll ? Math.max(50, .5 * width * width / neededWidth) : 0
        },
        positions: positions
      }
    },
    _updatePositions: function() {
      var status = this.itemBrowser('_calculatePositions');
      this.itemBrowser('_displayScroll', status.scroll);
      for (var i in status.positions) {
        var pos = status.positions[i];

        if ((pos.neww > 1 || pos.oldw > 1) && (Math.abs(pos.newx - pos.oldx) > 1 || Math.abs(pos.neww - pos.oldw) > 1)) {
          $(pos.element).itemBrowserItem('showInfo', pos.showdata);
          $(pos.element).css({
            left: pos.newx,
            width: pos.neww
          });
        }
      }
    },
    _updatePositionsAnimate: function() {
      var status = this.itemBrowser('_calculatePositions');
      this.itemBrowser('_displayScroll', status.scroll);
      for (var i in status.positions) {
        var pos = status.positions[i];
        $(pos.element).itemBrowserItem('showInfo', pos.showdata);

        $(pos.element).animate({
          left: pos.newx + 'px',
          width: pos.neww + 'px'
        }, 'fast');
      }
    },
    _displayScroll: function(scroll) {
      this.find('.item-browser-scroll-container').css('width', scroll.active ? '100%' : '0px');
      this.find('.item-browser-scroll-bar').css({
        width: scroll.width,
        left: this.data('scroll') * (this.find('.item-browser-scroll-container').width() - scroll.width)
      });
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

      if (options.clip) {
        var header = $('<div/>')
                .addClass('item-browser-item-header');
        this.append(header);
        this.find('.item-browser-item-header').click(function() {
          $(this).parent().itemBrowserItem('_toogleClip');
        });
      }

      var imgcontainer = $("<div/>").addClass("item-browser-item-img-container").appendTo(this);
      $("<img/>").attr("src", item.img).addClass("item-browser-item-img").appendTo(imgcontainer);
      $("<div/>").addClass("item-browser-item-img-open").appendTo(imgcontainer);
      
      var title = $("<div/>").addClass("item-browser-item-title");
      if (options.select && !item.params.unselectable) {
        var selectId = id + '-select';
        $(title).append($('<input id="' + selectId + '" type="radio" name="' + options.id + '" value="' + item.id + '" />'));
        $(title).append($('<label/>').html(item.title).attr('for', selectId));
      } else {
        $(title).html(item.title);
      }
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

      this.itemBrowserItem('stay');

      this.find('.item-browser-item-img-open,.item-browser-item-title-open').click(function() {
        $(this).parents('.item-browser-item').itemBrowserItem('_event', 'imgclick');
      });

      this.find('#' + id + '-select').change(function() {
        $(this).parents('.item-browser-item[item-id="' + $(this).attr('value') + '"]').itemBrowserItem('_select');
      });

      this.itemBrowserItem('_event', 'itemadded');

      return this;
    },
    playAppearAnimation : function() {
      this.css('opacity', 0);
      this.animate({opacity: 1}, 'fast');
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
    unselect: function() {
      this.removeClass("item-browser-item-selected");
      this.find('input').attr('checked', false);
      return this;
    },
    select: function() {
      this.addClass("item-browser-item-selected");
      this.find('input').attr('checked', true);
      this.itemBrowserItem('_clip');
      return this;
    },
    _select: function() {
      this.addClass("item-browser-item-selected").itemBrowserItem('_event', 'itemselected');
      this.itemBrowserItem('_clip');
      return this;
    },
    _event : function(type) {
      this.parent().itemBrowser('_event', type, this.data('item'));
      return this;
    },
    _clip: function() {
      this.find('.item-browser-item-header').addClass('item-browser-item-header-clip');
      return this;
    },
    _toogleClip: function() {
      if (this.find('.item-browser-item-header').hasClass('item-browser-item-header-clip')) {
        this.find('.item-browser-item-header-clip').removeClass('item-browser-item-header-clip');
        this.itemBrowserItem('_removeIfNeeded');

        if (this.hasClass("item-browser-item-selected")) {
          this.itemBrowserItem('unselect');
          this.itemBrowserItem('_event', 'itemunselected');
        }
      } else {
        this.itemBrowserItem('_clip');
      }
      return this;
    },

    stay: function() {
      this.data('wanted', true);
      return this;
    },
    remove : function(callback) {
      this.data('wanted', false).itemBrowserItem('_removeIfNeeded', callback);
      return this;
    },
    _removeIfNeeded: function(callback) {
      if (!this.data('wanted') && !this.find('.item-browser-item-header').hasClass('item-browser-item-header-clip')) {
        this.find().unbind('click');
        this.itemBrowserItem('_event', 'itemremoved');
        this.fadeOut('fast', function() {
          $(this).remove();
          if (callback) {
            callback();
          }
        });
      } else if (callback) {
        callback();
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