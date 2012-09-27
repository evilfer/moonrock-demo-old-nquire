
var MoonrockVmViewHistory = {
  enabled: null,
  callback: null,
  base: null,
  
  init: function() {
    this.enabled = false;
  },
  
  enable: function(callback) {
    var self = this;
    
    self.enabled = true;
    self.callback = callback;
    self.base = location.href;
    
    $(window).bind('hashchange', function(e) {
      if (self.callback) {
        var vm = location.href.indexOf('#vm=true') >= 0;
        self.callback(vm);
      }
    });    
  },
  
  back: function() {
    history.go(-1);
    this.callback(false);
  },
  
  forward: function() {
    $.bbq.pushState({
      vm: true
    });
    this.callback(true);
  }
};

