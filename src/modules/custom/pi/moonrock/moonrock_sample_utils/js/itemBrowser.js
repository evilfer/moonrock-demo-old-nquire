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
        metadataCallback: null
      }, options, {
        id: this.attr('id')
      });

      this.html("")
              .addClass("item-browser-container")
              .data('settings', settings)
              .data('selected', null);
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
    },
    _event: function(type, item) {
      if (type === 'itemselected') {
        this.data('selected', item);
        this.find('.item-browser-item[item-id!="' + item.id + '"]').itemBrowserItem('_unselect');
      }
      var settings = this.data('settings');
      if (settings.eventCallback) {
        settings.eventCallback(type, item, settings.id);
      }
    },
    _getMetadata: function(item) {
      var metadata = this.data('settings').metadataCallback(item, this.data('settings').id);
      return metadata;
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

      this.append($("<img/>").attr("src", item.img).addClass("item-browser-item-img"));

      var title = $("<div/>").addClass("item-browser-item-title");
      if (options.select) {
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
        $(title).append(content);
        $(title).append(cluetip);
        $(cluetip).qtip({
          content: {
            title: '',
            text: ''
          },
          position: {
            corner: {
              target: 'topRight',
              tooltip: 'bottomLeft'
            },
            adjust : {
              resize: true
            }
          },
          show: {
            delay: 0
          },
          hide: {
            fixed: true,
            delay: 200
          },
          api: {
            onRender: function() {
              this.updateContent("");
            },
            beforeShow: function() {
              var metadata = self.parent().itemBrowser('_getMetadata', self.data('item'));
              this.updateTitle(metadata.title);
              this.updateContent(" ");
              this.updateContent(metadata.content);
            }
          }
        });

        /*  content: {
            text: 'text',
            title: {
              text: 'title',
              button: true
            }
          },
          position: {
            my: 'left bottom', // Use the corner...
            at: 'right bottom' // ...and opposite corner
          },
          /* show: {
            event: false, // Don't specify a show event...
            ready: true // ... but show the tooltip when ready
          },
          hide: false, // Don't specify a hide event either!
          

          style: {
            classes: 'ui-tooltip-shadow ui-tooltip-bootstrap'
          } 
        }*/


        /*          onActivate: function() {
            $('#' + contentId).html(self.parent().itemBrowser('_getMetadata', self.data('item')));
            return true;
          },
          mouseOutClose: false,
          local: true,
          showTitle: false
        });*/
      }
      this.append(title);

      this.itemBrowserItem('stay').fadeIn('fast');

      this.find('img').click(function() {
        $(this).parent().itemBrowserItem('_event', 'imgclick');
      });
      this.find('#' + id + '-select').change(function() {
        $(this).parents('.item-browser-item[item-id="' + $(this).attr('value') + '"]').itemBrowserItem('_select');
      });

      return this;
    },
    _unselect: function() {
      this.removeClass("item-browser-item-selected");
      return this;
    },
    _select: function() {
      this.addClass("item-browser-item-selected").itemBrowserItem('_event', 'itemselected');
      return this;
    },
    _event : function(type) {
      this.parent().itemBrowser('_event', type, this.data('item'));
      return this;
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