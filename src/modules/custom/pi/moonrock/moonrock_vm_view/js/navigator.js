

var VmNavigator = {
  _prev: false,
  _next: false,
  
  init: function() {
    var self = this;
    
    $('#moonrock-vm-navigator-previous').click(function() {
      if ($(this).hasClass('enabled')) {
        VmManager.sampleSelected(self._prev);
      }
    });
    $('#moonrock-vm-navigator-next').click(function() {
      if ($(this).hasClass('enabled')) {
        VmManager.sampleSelected(self._next);
      }
    });
  },
  
  update: function(sample) {
    var samples = MoonrockSeeSamples.getItems();
    
    $('#moonrock-samples-page-vm-sample-title').html(sample.title);
    
    this._prev = this._next = false;
    
    for (var i = 0; i < samples.length; i++) {
      if (samples[i].id === sample.id) {
        this._prev = i > 0 ? samples[i-1] : false;
        this._next = i < samples.length - 1 ? samples[i+1] : false;
        break;
      }
    }
    
    var f = function(id, enabled) {
      if (enabled) {
        $(id).addClass('enabled');
      } else {
        $(id).removeClass('enabled');
      }
    }
    
    f('#moonrock-vm-navigator-previous', this._prev);
    f('#moonrock-vm-navigator-next', this._next);
  }
};

$(function() {
  VmNavigator.init();
});

