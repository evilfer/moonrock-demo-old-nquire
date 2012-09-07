




(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        selectionCallback: false,
        opencloseCallback: false,
        defaultValue: ''
      }, options);

      var self = this;

      self.data('rock-color-picker-selection-callback', _options.selectionCallback);
      self.data('rock-color-picker-openclose-callback', _options.opencloseCallback);

      $('#rock-color-picker-container').each(function() {
        $(this).remove().appendTo(self);
      });

      this.keyup(function(event) {
        if (event.target.type !== 'textarea' && event.target.type !== 'text') {
          console.log(event.keyCode);
          switch (event.keyCode) {
            case 67:
              self.rockColorPicker('toggle');
              break;
            default:
              break;
          }
        }
      });

      $('#rock-color-picker-container').mousewheel(function(event, delta) {
        var k = delta > 0 ? 1.25 : .8;

        var w = $('#rock-color-picker-container').width();
        var neww = Math.max(50, Math.min(2000, k*w));
        var appliedk = neww / w;
        var newh = appliedk * $('#rock-color-picker-container').height();
        var pos = $('#rock-color-picker-container').position();
        
        var newpos = {
          left: event.pageX - appliedk * (event.pageX - pos.left) - $(window).scrollLeft(),
          top: event.pageY - appliedk * (event.pageY - pos.top) - $(window).scrollTop(),
          width: neww,
          height: newh
        };

        $('#rock-color-picker-container').css(newpos);
        
        event.preventDefault();
        event.stopPropagation();
      });

      $('#rock-color-picker-container').mousedown(function(event) {
        self.data('rock-color-picker-selection-drag-mx', event.pageX - $('#rock-color-picker-container').position().left);
        self.data('rock-color-picker-selection-drag-my', event.pageY - $('#rock-color-picker-container').position().top);
        self.data('rock-color-picker-selection-mousedown', true);
        self.data('rock-color-picker-selection-dragging', false);
      });
      self.mousemove(function(event) {
        if (self.data('rock-color-picker-selection-mousedown')) {
          event.preventDefault();
          event.stopPropagation();

          self.data('rock-color-picker-selection-dragging', true);
          var current_pos = $('#rock-color-picker-container').position();
          var margin = 100;
          var w = $('#rock-color-picker-container').width();
          var h = $('#rock-color-picker-container').height();
          var ww = $(window).width();
          var wh = $(window).height();
          var dx = event.pageX - $(window).scrollLeft() - self.data('rock-color-picker-selection-drag-mx');
          var dy = event.pageY - $(window).scrollTop() - self.data('rock-color-picker-selection-drag-my');
          
          $('#rock-color-picker-container').css({
            left: Math.max(margin - w, Math.min(ww - margin, dx)),
            top: Math.max(margin - h, Math.min(wh - margin, dy))
          });
        }
      });
      $('.rock-color-picker-chip').mouseup(function(event) {
        if (self.data('rock-color-picker-selection-mousedown') && !self.data('rock-color-picker-selection-dragging')) {
          self.rockColorPicker('_setValue', $(this).attr('color-value'), true);
        }
      });
      self.mouseup(function(event) {
        if (self.data('rock-color-picker-selection-mousedown')) {
          self.data('rock-color-picker-selection-mousedown', false);
        }
      });

      this.rockColorPicker('_setValue', _options.defaultValue, true);
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
    _setValue: function(value, notify) {
      this.data('rock-color-picker-selected', value);
      $('.rock-color-picker-chip').attr('selected', false);
      $('.rock-color-picker-chip[color-value="' + value + '"]').attr('selected', true);
      var color = false;
      var name = false;
      if (value.length > 0) {
        color = $('.rock-color-picker-chip[color-value="' + value + '"]').attr('color-html');
        name = $('.rock-color-picker-chip[color-value="' + value + '"]').attr('title');
      }

      if (notify && this.data('rock-color-picker-selection-callback')) {
        this.data('rock-color-picker-selection-callback')(value, color, name);
      }
    },
    clearSelection: function() {
      this.rockColorPicker('_setValue', '', true);
      this.rockColorPicker('close');
    }
  };

  $.fn.rockColorPicker = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.rockColorPicker');
    }
  };
})(jQuery);