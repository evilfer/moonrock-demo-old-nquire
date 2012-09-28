

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
