

(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        eventCallback: null,
        imageLink: false
      }, options, {
        id: this.attr('id')
      });
      
      var self = this;
      self.data('options', _options);
      
      
      self.html('').addClass('item-browser');
      var left = $('<div/>').addClass('item-browser-left').appendTo(self);
      var container = $('<div/>').addClass('item-browser-container').appendTo(self);
      var slider = $('<div/>').addClass('item-browser-slider').appendTo(container);
      var right = $('<div/>').addClass('item-browser-right').appendTo(self);
      
      slider.customMouseInput('move', function(deltaX) {
        self.itemBrowser('_slide', deltaX);
      });
      
      left.customMouseInput('click', function() {
        //if ($(this).hasClass('enabled')) {
        self.itemBrowser('_slide', 'left');
      //}
      });
      right.customMouseInput('click', function() {
        //if ($(this).hasClass('enabled')) {
        self.itemBrowser('_slide', 'right');
      //}
      });
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
    updateItems: function(items) {
      this.itemBrowser('_setItems', items, false);
    },
    _setItems: function(items, deleteOld) {
      var itemsToKeep = {};
      for (var i in items) {
        itemsToKeep[items[i].id] = items[i];
      }
      var self = this;
      
      var currentIds = {};
      var itemsToRemove = [];
      this.find(".item-browser-item").each(function() {
        var id = $(this).attr('item-id');
        if (itemsToKeep[id]) {
          currentIds[id] = true;
          self.itemBrowser('_updateItem', itemsToKeep[id], $(this));
        } else if (deleteOld) {
          itemsToRemove.push(this);
        }
      });

      for (var i in itemsToRemove) {
        $(itemsToRemove[i]).remove();
      }
      
      for (var i in items) {
        if (!currentIds[items[i].id]) {
          this.itemBrowser("_addItem", items[i]);
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
      var id = this.data('options').id + '-' + item.id;
      var slider = this.find('.item-browser-slider');
      
      var element = $("<div />")
      .data('item', item)
      .addClass('item-browser-item')
      .appendTo(slider)
      .data('item', item)
      .attr('id', id)
      .attr("item-id", item.id);
      
      var image = $("<img/>")
      .appendTo(element);//.css('display', 'none');
            
      var self = this;
      image[0].onload = function() {
        self.itemBrowser('_checkSliderPosition');
        element.css('width', $(this).width() + 6);
      };
      
      image.attr("src", item.image + '?t=' + (new Date()).getTime());
      
      if (this.data('options').imageLink) {
        var link = $("<div/>").addClass('open').appendTo(element);
        link.customMouseInput('click', function() {
          var _item = element.data('item');
          self.itemBrowser('_event', 'imgclick', _item);
        });
      }
    },
    _event: function(type, item) {
      var options = this.data('options');
      if (options.eventCallback) {
        options.eventCallback(type, item, options.id);
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
      return this.find('.item-browser-item[item-id="' + itemId + '"]').data('item');
    },
    itemAt: function(index) {
      return $(this.find('.item-browser-item')[index]).data('item');
    },
    countItems: function() {
      return this.find('.item-browser-item').length;
    },
    itemWidget:function(itemId) {
      return this.find('.item-browser-item[item-id="' + itemId + '"]');
    },
    updateItem: function(item) {
      this.itemBrowser('_updateItem', item, this.find('.item-browser-item[item-id="' + item.id + '"]'));
    },
    _updateItem: function(item, element) {
      element.data('item', item).find('img').attr("src", item.image + '?t=' + (new Date()).getTime());
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
      var self = this;
      
      this.find('.item-browser-item').each(function() {
        self.itemBrowser('_setItemClass', $(this), 'item-browser-item-selected', $(this).attr('item-id') == id);
      });
      
      /*      if (id) {
        this.itemBrowser('centerOn', id);
      }*/
      return this;
    },
    _setItemClass: function(element, className, enabled) {
      if (enabled) {
        element.addClass(className);
      } else {
        element.removeClass(className);
      }
    },
    _checkSliderPosition: function() { 
      var container = this.find('.item-browser-container');
      var slider = container.find('.item-browser-slider');
      var width = container.width();
      var sliderWidth = slider.width();
      
      if (sliderWidth <= width) {
        slider.css('left', 0);
        this
        .itemBrowser('_enableButton', 'left', false)
        .itemBrowser('_enableButton', 'right', false);
      } else {
        var pos = slider.position().left;
        var correctedPos = Math.min(0, Math.max(width - sliderWidth, pos));
        if (pos != correctedPos) {
          slider.css('left', correctedPos);
        }
        
        this
        .itemBrowser('_enableButton', 'left', correctedPos < 0)
        .itemBrowser('_enableButton', 'right', correctedPos > width - sliderWidth);
      }
    },
    _enableButton: function(button, enabled) {
      if (enabled) {
        this.find('.item-browser-' + button).addClass('enabled');
      } else {
        this.find('.item-browser-' + button).removeClass('enabled');
      }
      return this;
    },
    
    _slide: function(slide) {
      var self = this;
      
      var container = this.find('.item-browser-container');
      var slider = container.find('.item-browser-slider');
      var width = container.width();
      var sliderWidth = slider.width();
      var pos = slider.position().left;
      
      var newPos;
      var animate;
      
      switch(slide) {
        case 'left':
          newPos = pos + .5 * width;
          animate = true;
          break;
        case 'right':
          newPos = pos - .5 * width;
          animate = true;
          break;
        default:
          newPos = pos + slide;
          animate = false;
          break;
      }
      var correctedPos = Math.min(0, Math.max(width - sliderWidth, newPos));
      if (pos != correctedPos) {
        if (animate) {
          slider.animate({
            left: correctedPos
          }, function() {
            self.itemBrowser('_checkSliderPosition');
          });
        } else {
          slider.css({
            left: correctedPos
          });
          self.itemBrowser('_checkSliderPosition');
        }
      }
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
