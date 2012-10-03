
(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        selectionCallback: false,
        opencloseCallback: false,
        defaultValue: ''
      }, options);

      var self = this;
      var picker = $('#rock-color-picker-container');


      self.data('rock-color-picker-user-selection-callbacks', []);
      self.data('rock-color-picker-selection-callback', _options.selectionCallback);
      self.data('rock-color-picker-openclose-callback', _options.opencloseCallback);

      $('#rock-color-picker-container').each(function() {
        $(this).remove().appendTo(self);
      });
      
      picker.css({
        top: .5 * ($(window).height() - picker.height()),
        left: .5 * ($(window).width() - picker.width())
      });
      
      picker.customMouseInput('sizing', function(k, x, y, dx, dy) {
        var w = picker.width();
        var neww = Math.max(200, Math.min(2000, k*w));
        var appliedk = neww / w;
        var newh = appliedk * picker.height();
        var pos = picker.position();
        
        var newstate = {
          left: x - appliedk * (x - pos.left) - $(window).scrollLeft() + dx,
          top: y - appliedk * (y - pos.top) - $(window).scrollTop() + dy,
          width: neww,
          height: newh
        };

        picker.css(newstate);
      });
      
      picker.customMouseInput('move', function(deltaX, deltaY) {
        var margin = 100;
        var w = picker.width();
        var h = picker.height();
        var ww = $(window).width();
        var wh = $(window).height();
        var pos = picker.offset();
        pos.left = Math.max(margin - w, Math.min(ww - margin, pos.left + deltaX - $(window).scrollLeft()));
        pos.top = Math.max(margin - h, Math.min(wh - margin, pos.top + deltaY - $(window).scrollTop()));
          
        picker.css(pos);
      });
      
      $('.rock-color-picker-chip').customMouseInput('click', function(element) {
        self.rockColorPicker('_setValue', $(element).attr('color-value'), true);
        self.rockColorPicker('close');
      });
      
      $('#rock-color-picker-close').customMouseInput('click', function() {
        self.rockColorPicker('close');
      });

      this.rockColorPicker('_setValue', _options.defaultValue, false);
    },
    open: function() {
      $('#rock-color-picker-container').fadeIn();
      if (this.data('rock-color-picker-openclose-callback')) {
        this.data('rock-color-picker-openclose-callback')(true);
      }
    },
    close: function() {
      $('#rock-color-picker-container').fadeOut();
      if (this.data('rock-color-picker-openclose-callback')) {
        this.data('rock-color-picker-openclose-callback')(false);
      }
    },
    toggle: function() {
      if ($('#rock-color-picker-container').is(':visible')) {
        this.rockColorPicker('close');
      } else {
        this.rockColorPicker('open');
      }
      return this;
    },
    _setValue: function(value, userAction) {
      this.data('rock-color-picker-selected', value);
      $('.rock-color-picker-selection-border').hide();
      var color = false;
      var name = false;
      if (value.length > 0) {
        $('.rock-color-picker-chip[color-value="' + value + '"] > .rock-color-picker-selection-border').show();
        color = $('.rock-color-picker-chip[color-value="' + value + '"]').attr('color-html');
        name = $('.rock-color-picker-chip[color-value="' + value + '"]').attr('title');
      }

      (this.data('rock-color-picker-selection-callback'))(value, color, name);
      
      if (userAction) {
        var callbacks = this.data('rock-color-picker-user-selection-callbacks');
        for(var i in callbacks) {
          (callbacks[i])(value, color, name);
        }
      }
    },
    clearSelection: function(userAction) {
      this.rockColorPicker('_setValue', '', userAction);
      this.rockColorPicker('close');
    },
    select: function(value) {
      this.rockColorPicker('_setValue', value, false);
    },
    addUserSelectionCallback: function(callback) {
      var callbacks = this.data('rock-color-picker-user-selection-callbacks');
      callbacks.push(callback);
      this.data('rock-color-picker-user-selection-callbacks', callbacks);
    }
  };

  $.fn.rockColorPicker = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.rockColorPicker');
      return false;
    }
  };
})(jQuery);