
(function($) {
  
  var directBinds = {
    touch: {
      down: 'touchstart',
      up: 'touchend',
      move: 'touchmove'
    },
    mouse: {
      down: 'mousedown',
      up: 'mouseup',
      move: 'mousemove'
    }
  };

  var methods = {
    '_type': function() {
      if (navigator.userAgent.match(/iPad/i) != null) {
        return 'ipad';
      } else if (navigator.userAgent.match(/Android/i) != null) {
        return 'android';
      } else {
        return 'other';
      }
    },
    

    'move': function(callback) {
      this.customMouseInput('_directBind', 'down', function(event) {
        $('body')
        .data('customMouseInputMovingPoint', {
          x: event.pageX, 
          y: event.pageY
        })
        .data('customMouseInputMovingCallback', callback)
        .disableSelection();
      });
    },
    'click': function(callback) {
      var self = this;
      
      self.each(function() {
        var element = this;
        
        $(this).customMouseInput('_directBind', 'down', function() {
          $('body').data('customMouseInputIsClick', {
            fn: callback,
            element: element
          });
        });
      });
    },
    'sizing': function(callback) {
      switch(this.customMouseInput('_type')) {
        case 'ipad':
        case 'android':
          var d = function(touches) {
            var dx = touches[0].pageX - touches[1].pageX;
            var dy = touches[0].pageY - touches[1].pageY;
            return Math.sqrt(dx*dx + dy*dy);
          };
          var c = function(touches) {
            return {
              x: .5 * (touches[0].pageX + touches[1].pageX),
              y: .5 * (touches[0].pageY + touches[1].pageY)
            };
          };
          
          this[0].addEventListener('touchstart', function(event) {
            if (event.touches.length == 2) {
              event.preventDefault();
              event.stopPropagation();
              
              $('body')
              .data('customMouseInputIsClick', false)
              .data('customMouseInputMovingCallback', false)
              .data('customMouseInputSizingDistance', d(event.touches))
              .data('customMouseInputSizingCenter', c(event.touches));
            }
          }, false);
          
          this[0].addEventListener('touchmove', function(event) {
            if (event.touches.length == 2) {
              event.preventDefault();
              event.stopPropagation();

              var oldD = $('body').data('customMouseInputSizingDistance');
              var newD = d(event.touches);
              var oldC = $('body').data('customMouseInputSizingCenter');
              var newC = c(event.touches);
              var dC = {
                x: newC.x - oldC.x,
                y: newC.y - oldC.y
              };
              var k = newD / oldD;
              
              $('body')
              .data('customMouseInputSizingDistance', newD)
              .data('customMouseInputSizingCenter', newC);
              callback(k, newC.x, newC.y, dC.x, dC.y);
            }
          }, false);
          
          break;
        case 'other':
          this.mousewheel(function(event, delta) {
            event.preventDefault();
            event.stopPropagation();
            var k = delta > 0 ? 1.25 : .8;
            callback(k, event.pageX, event.pageY, 0, 0);
          });
          break
        default:
          break;
      }
      return this;
    },
    '_directBind': function(eventType, callback) {
      switch(this.customMouseInput('_type')) {
        case 'ipad':
        case 'android':
          this[0].addEventListener(directBinds.touch[eventType], function(event) {
            if (event.touches.length <= 1) {
              var standardEvent = event.touches.length > 0 ? event.touches[0] : null;
              callback(standardEvent, event);
            }
          }, false);
          break;
        case 'other':
          this.bind(directBinds.mouse[eventType], function(event) {
            if (eventType === 'up') {
              var a = 1;
              a = 2;
            }
            callback(event, event);
          });
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
})(jQuery);

$(function() {
  $('body').customMouseInput('_directBind', 'move', function(event, consumableEvent) {
    $('body').data('customMouseInputIsClick', false);
    
    var movingCallback = $('body').data('customMouseInputMovingCallback');
    if (movingCallback) {      
      consumableEvent.preventDefault();
      consumableEvent.stopPropagation();
      var point = $('body').data('customMouseInputMovingPoint');
        
      var deltaX = event.pageX - point.x, deltaY = event.pageY - point.y;
      $('body').data('customMouseInputMovingPoint', {
        x: event.pageX, 
        y: event.pageY
      });
      movingCallback(deltaX, deltaY);
    }
  });  
  
  $('body').customMouseInput('_directBind', 'up', function() {
    var data = $('body').data('customMouseInputIsClick');
    if (data) {
      data.fn(data.element);
      $('body').data('customMouseInputIsClick', false);
    }
    $('body').data('customMouseInputMovingCallback', false);
    $('body').enableSelection();
  });
});
