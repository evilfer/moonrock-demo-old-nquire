




(function($) {

  var methods = {
    init : function(colors, defaultcolor) {
      this.data('colors', colors);
      this.data('defaultcolor', defaultcolor);

      var self = this;

      this.keyup(function(event) {
        if (event.target.type !== 'textarea' && event.target.type !== 'text') {
          console.log(event.keyCode);
          switch (event.keyCode) {
            case 67:
              self.rockColorPicker('open');
              break;
            case 27:
              self.rockColorPicker('close');
              break;
            default:
              break;
          }
        }
      });
    },
    open: function() {
      $('<div/>').addClass('rock-color-picker-overlay rock-color-picker-overlay-bottom').appendTo(this);

      var topOverlay = $('<div/>').addClass('rock-color-picker-overlay rock-color-picker-overlay-top').appendTo(this);
      
      
      var svgCode = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="600" style="background-color: #D2B48C;">';
      var gCode = '<g id="myGroup" fill-rule="evenodd" fill="blue" style="font-size: 18px; text-anchor: middle; font-family: serif;">';
      

      var chipWidth = 30;
      var chipHeight = 40;
      var chipVGap = 15;
      var chipHGap = 15;

      var holeRadius = chipWidth / 2;

      var borderCenterVDistance = .5 * chipVGap;
      var borderCenterHDistance = Math.sqrt(holeRadius * holeRadius - borderCenterVDistance * borderCenterVDistance);
      var borderCircleCrossX = .5 * chipWidth - borderCenterHDistance;




      var path = ' v' + chipHeight +
              ' h' + borderCircleCrossX +
              ' a' + holeRadius + ',' + holeRadius + ' 0 0,1 ' + (2 * borderCenterHDistance) + ',0' +
              ' h' + borderCircleCrossX +
              ' v' + (-chipHeight) +
              ' z';

      var circlePath = "M0,0 v500 h500 v-500 z ";

      var colors = this.data('colors');
      for (var i in colors) {
        var x = (20 + (chipWidth + chipHGap) * i);
        var holeX = x + .5 * chipWidth - holeRadius;
        var y = 20;
        var holeY = y + chipHeight + .5 * chipVGap;

        var circle = 'M' + holeX + ',' + holeY + ' a' + holeRadius + ',' + holeRadius + ' 0 0,0 ' + (2 * holeRadius) + ',0';
        circle += ' a' + holeRadius + ',' + holeRadius + ' 0 0,0 ' + (-2 * holeRadius) + ',0 z ';

        circlePath += circle;
      }

      var squareCode = '<rect x="1" y="1" width="500" height="400"/>';
      var holesCode = '<path d="' + circlePath + '"/>';
      var svg = $(svgCode + gCode + holesCode + '</g></svg>');
      $(svg).appendTo(topOverlay);
    },
    close: function() {
      this.find('.rock-color-picker-overlay').remove();
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