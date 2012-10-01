

(function($) {

  var methods = {
    init : function(options) {
      var settings = $.extend({
        eventCallback: null,
        itemWidth: 200,
        itemMargin: 20,
        taperingPortion: .2,
        imageLink: false,
        createTitle: false
      }, options, {
        id: this.attr('id')
      });

      this.html("")
      .addClass("item-browser-container")
      .data('settings', settings)
      .data('scroll', 0)
      .data('scrolling', false);

      var scrollContainer = $('<div/>').addClass("item-browser-scroll-container").appendTo(this);
      $('<div/>').addClass('item-browser-scroll-bar').appendTo(scrollContainer);

      var self = this;
      this.find('.item-browser-scroll-bar').css('left', 0);
      
      var isiPad = navigator.userAgent.match(/iPad/i) != null;
      alert(isiPad);
      
      if (isiPad) {
        var bar = this.find('.item-browser-scroll-bar');
        bar[0].addEventListener('touchstart', function(e) {
          var event = e.touches[0];
          self.itemBrowser('_eventUIBarDown', event);
          return false;
        }, false);      
        this[0].addEventListener('touchstart', function(e) {
          var event = e.touches[0];
          self.itemBrowser('_eventUIDown', event);
          return false;
        }, false);
        document.addEventListener('touchmove', function(e) {
          var event = e.touches[0];
          self.itemBrowser('_eventUIMove', event);
          return false;
        }, false);
        document.addEventListener('touchend', function(e) {
          var event = e.touches[0];
          self.itemBrowser('_eventUIUp', event);
          return false;
        }, false);
      } else {
        this.find('.item-browser-scroll-bar').mousedown(function(event) {
          self.itemBrowser('_eventUIBarDown', event);
          return false;
        });      
        this.mousedown(function(event) {
          self.itemBrowser('_eventUIDown', event);
        });
        $(document).mouseup(function(event) {
          self.itemBrowser('_eventUIUp', event);
        });
        $(document).mousemove(function(event) {
          self.itemBrowser('_eventUIMove', event);
        });
      }

      return this;
    },
    _eventUIBarDown: function(event) {
      if (!this.data('scrolling')) {
        this.data('scrolling', 'bar');
        this.data('scrollPositionInHandle', event.pageX - this.find('.item-browser-scroll-bar').position().left);
        $('body').disableSelection();
      }
      return this;
    },
    _eventUIDown: function(event) {
      if (!this.data('scrolling')) {
        this.data('scrolling', 'items');
        this.data('scrollPositionInHandle', event.pageX);
      }
      return this;
    },
    _eventUIMove: function(event) {
      
      var scrolling = this.data('scrolling');
      if (scrolling) {
        var containerWidth = this.width();
        var scrollBarWidth = this.find('.item-browser-scroll-bar').width();
        var scrollWidth = containerWidth - scrollBarWidth;
        var newPos = 0;
        var update = false;
          
        if (scrolling == 'bar') {
          var currentPos = this.find('.item-browser-scroll-bar').position().left;
          newPos = Math.max(0, Math.min(scrollWidth, event.pageX - this.data('scrollPositionInHandle')));
          if (newPos != currentPos) {
            update = true;
            this.data('scroll', newPos / scrollWidth);
          }
        } else {
          var delta = (event.pageX - this.data('scrollPositionInHandle'));
          if (delta != 0) {
            update = true;
              
            var itemWidth = this.data('settings').itemWidth;
            var itemMargin = this.data('settings').itemMargin;
            var itemCount = this.itemBrowser('countItems');

            var neededWidth = itemWidth * itemCount + (itemCount - 1) * itemMargin;
              
            this.data('scrollPositionInHandle', event.pageX);
            var scroll = Math.max(0, Math.min(1, this.data('scroll') - delta / neededWidth));
            this.data('scroll', scroll);
            newPos = scroll * scrollWidth;
          }
        } 
          
        if (update) {
          this.find('.item-browser-scroll-bar').css('left', newPos);
          this.itemBrowser('_updatePositions');
        }
        event.stopPropagation();
        event.preventDefault();
      }
      return this;
    },
    _eventUIUp: function() {
      this.data('scrolling', false);
      $('body').enableSelection();
      return this;
    },
    clear : function() {
      this.itemBrowser('setItems', []);
    },
    appendItems: function(items) {
      this.itemBrowser('_setItems', items, false);
    },
    setItems : function(items) {
      this.itemBrowser('_setItems', items, true);
    },
    _setItems: function(items, deleteOld) {
      
      var avNewPosition = 0.0;
      var newItemCount = 0.0;
      
      var itemsToKeep = {};
      for (var i in items) {
        itemsToKeep[items[i].id] = items[i];
      }

      var currentIds = {};
      var itemsToRemove = [];
      this.find(".item-browser-item").each(function() {
        var id = $(this).attr('item-id');
        if (itemsToKeep[id]) {
          currentIds[id] = true;
          $(this).itemBrowserItem('update', itemsToKeep[id]);
        } else if (deleteOld) {
          itemsToRemove.push(this);
        }
      });
      var count = itemsToRemove.length;
      
      var self = this;

      var afterRemove = function() {
        for (var i in items) {
          if (!currentIds[items[i].id]) {
            self.itemBrowser("_addItem", items[i])
            .itemBrowserItem('setNew', true);
            avNewPosition += parseFloat(i);
            newItemCount++;
          } 
        }
        avNewPosition = newItemCount > 0 && items.length > 1 ? avNewPosition / (newItemCount * (items.length - 1)) : false;
        self.itemBrowser('_updatePositionsAnimate', avNewPosition);
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
    _addItem: function(item) {
      return $("<div />").appendTo(this).itemBrowserItem(item, this.data('settings'));
    },
    _event: function(type, item) {
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
    getItem: function(itemId) {
      return this.find('.item-browser-item[item-id="' + itemId + '"]').itemBrowserItem('getItem');
    },
    itemAt: function(index) {
      return $(this.find('.item-browser-item')[index]).itemBrowserItem('getItem');
    },
    countItems: function() {
      return this.find('.item-browser-item').length;
    },
    itemWidget:function(itemId) {
      return this.find('.item-browser-item[item-id="' + itemId + '"]');
    },
    update: function() {
      if (this.length > 0) {
        //        this.itemBrowser('_updatePositionsAnimate');
        this.itemBrowser('_updatePositions');
      }
      return this;
    },
    updateItem: function(item) {
      this.find('.item-browser-item[item-id="' + item.id + '"]').itemBrowserItem('update', item);
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
            neww: w,
            showdata: w > .5 * itemWidth
          });
        });
      } else {
        var x0 = 0; //.5 * (width - neededWidth);
        
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
            width: Math.max(1, pos.neww)
          });
          if (pos.neww < 1) {
            $(pos.element).hide();
          } else {
            $(pos.element).show();
          }
        }
      }
      this.itemBrowser('_updateHeight');
    },
    _updatePositionsAnimate: function(newScrollPosition) {
      if (this.data !== false) {
        this.data('scroll', newScrollPosition);
      }
      
      var status = this.itemBrowser('_calculatePositions');
      
      this.itemBrowser('_displayScroll', status.scroll);
      for (var i in status.positions) {
        var pos = status.positions[i];
        if (pos.neww < 1) {
          $(pos.element).hide();
          $(pos.element).css({
            left: pos.newx,
            width: Math.max(1, pos.neww)
          });
        } else {
          $(pos.element).show();
          $(pos.element).itemBrowserItem('showInfo', pos.showdata);

          $(pos.element).animate({
            left: pos.newx + 'px',
            width: pos.neww + 'px'
          }, 'fast');
        }
      }
      this.itemBrowser('_updateHeight');
    },
    _updateHeight: function() {
      var width = this.data('settings').itemWidth;
      var max = 0;
      this.find('.item-browser-item').each(function() {
        max = Math.max(max, width * $(this).itemBrowserItem('imageHeightRatio'));
      });
      this.css('height', max + 40);
      return this;
    },
    _displayScroll: function(scroll) {
      this.find('.item-browser-scroll-container').css('width', scroll.active ? '100%' : '0px');
      this.find('.item-browser-scroll-bar').css({
        width: scroll.width,
        left: this.data('scroll') * (this.find('.item-browser-scroll-container').width() - scroll.width)
      });
      return this;
    },
    centerOn: function(itemId) {
      var itemCount = this.itemBrowser('countItems');
      if (itemCount > 1) {
        var center = this.itemBrowser('position', itemId) / (itemCount - 1.0);
        this.itemBrowser('_updatePositionsAnimate', center);
      }
      return this;
    },
    select: function(id) {
      this.find('.item-browser-item').each(function() {
        $(this).itemBrowserItem('setSelected', $(this).attr('item-id') == id);
      });
      
      if (id) {
        this.itemBrowser('centerOn', id);
      }
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
      return false;
    }
  };
})(jQuery);
