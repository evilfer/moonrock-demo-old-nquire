

(function($) {

  var methods = {
    init : function(options) {
      var settings = $.extend({
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
      console.log(type + " - " + this.data('settings').id + " - " + item.id);

      var settings = this.data('settings');
      if (settings.eventCallback) {
        settings.eventCallback(type, item, settings.id);
      }
    },
    _getMetadata: function(item) {
      var metadata = this.data('settings').metadataCallback(item, this.data('settings').id);
      return metadata;
    },
    hasItem: function(itemId) {
      return this.find('.item-browser-item[item-id="' + itemId + '"]').length > 0;
    },
    position: function(itemId) {
      return this.find('.item-browser-item').index($('.item-browser-item[item-id="' + itemId + '"]'));
    },
    itemAt: function(index) {
      return $(this.find('.item-browser-item')[index]).itemBrowserItem('getItem');
    },
    countItems: function() {
      return this.find('.item-browser-item').length;
    },
    update: function() {
      this.itemBrowser('_updatePositions');
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
