
var MoonrockVmSizeData = {
  _data: {
    '14053': {
      "width":12831,
      "height":6407
    },
    '14310': {
      "width":6936,
      "height":6767
    },
    '70181': {
      "width":6965,
      "height":6969
    },
    '74220': {
      "width":4497,
      "height":4444
    },
    '78235': {
      "width":13370,
      "height":9280
    }
  },
  
  init: function() {
    
  },
  get: function(id) {
    return this._data[id];
  }
};

$(function() {
  MoonrockModules.register('MoonrockVmSizeData', MoonrockVmSizeData);
});

