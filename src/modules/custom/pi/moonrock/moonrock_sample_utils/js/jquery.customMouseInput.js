
(function($) {
  
  var binds = {
    ipad: {
      down: 'touchstart',
      up: 'touchend',
      move: 'touchmove'
    },
    other: {
      down: 'mousedown',
      up: 'mouseup',
      move: 'mousemove'
    }
  }
  
  var methods = {
    '_type': function() {
      var isiPad = navigator.userAgent.match(/iPad/i) != null;
      return isiPad ? 'ipad' : 'other';
    },
    

    'move': function(callback) {
      var self = this;
      
      self.customMouseInput('_bind', 'down', function(event) {
        self.data('customMouseInputPoint', {x: event.pageX, y: event.pageY});
        $(document).disableSelection();
      });
      $(document).customMouseInput('_bind', 'move', function(event) {
        var data = self.data('customMouseInputPoint');
        if (data) {
          var deltaX = event.pageX - data.x, deltaY = event.pageY - data.y;
          self.data('customMouseInputPoint', {x: event.pageX, y: event.pageY});
          callback(deltaX, deltaY);
        }
      });
      $(document).customMouseInput('_bind', 'up', function() {
        self.data('customMouseInputPoint', null);
        $(document).enableSelection();
      });
    },
    'click': function(callback) {
      this.customMouseInput('_bind', 'down', function() {
        $(document).data('customMouseInputIsClick', true);
      });
      
      this.customMouseInput('_bind', 'up', function() {
        if ($(document).data('customMouseInputIsClick')) {
          callback();
        }
      });
    },
    '_bind': function(event, callback) {
      switch(this.customMouseInput('_type')) {
        case 'ipad':
          this.bind(binds.ipad[event], function(event) {
            var standardEvent = event.touches[0];
            return callback(standardEvent);
          });
          break;
        case 'other':
          this.bind(binds.other[event], callback);
          break;
        default:
          break;
      }
    }
  };

  $.fn.customMouseInput = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.customMouseInput');
      return false;
    }
  };
  
  $(document).customMouseInput('_bind', 'move', function() {
    $(document).data('customMouseInputIsClick', false);
  });  

  
})(jQuery);

