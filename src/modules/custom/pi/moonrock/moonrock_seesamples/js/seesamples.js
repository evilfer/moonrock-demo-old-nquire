


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
    
    MoonrockVmState.get(function(data) {
      for(var id in data) {
        var sample = $('.vmSample[item-id="' + id + '"]');
        if (sample.length > 0 && !sample.vmSample('getSnapshot')) {
          sample.vmSample('setSnapshot', data[id]);
        }
      }
      return;
    });
  },  
  
  addCallback: function(callback) {
    this.eventCallbacks.push(callback);
  },
  
  getItems: function() {
    return this.items;
  },
  
  setSnapshot: function(sampleId, snapshot) {
    MoonrockVmState.set(sampleId, snapshot);
    $('.vmSample[item-id="' + sampleId + '"]').vmSample('setSnapshot', snapshot);
  }
  
};


$(function() {
  MoonrockSeeSamples.init();
});



