


var MoonrockSeeSamples = {
  eventCallbacks: [],
  items : [],
  
  init: function() {
    console.log('seesamples');
    
    var self = this;
    
    $('.vmSample').each(function() {
      $(this).vmSample({
        eventCallback: function(type, item) {
          for (var i in self.eventCallbacks) {
            var callback = self.eventCallbacks[i];
            callback(type, item);
          }
        }
      });
      self.items.push($(this).vmSample('getItem'));
    });
  },  
  
  addCallback: function(callback) {
    this.eventCallbacks.push(callback);
  },
  
  getItems: function() {
    return this.items;
  }
  
};


$(function() {
  MoonrockSeeSamples.init();
});



