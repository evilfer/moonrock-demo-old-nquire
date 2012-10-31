

var VmManager = {
  _sample: null,
  _sampleSelectionCallbacks: [],
  
  init: function() {
    var self = this;
    MoonrockSeeSamples.addCallback(function(type, item) {
      if (type === 'imgclick') {
        self.sampleSelected(item);
      }
    });
  },
  
  sampleSelected: function(sample) {
    this._setSample(sample);
    TabsManager.selectTab(sample.id);
  },
  
  vmTabOpened: function(id) {
    if (id == 'samples') {
      this._setSample(null);
    } else {
      this._setSample(MoonrockSeeSamples.getItem(id));
    }
  },
  
  addSampleSelectionCallback: function(callback) {
    this._sampleSelectionCallbacks.push(callback);
  },
  
  getActivityId : function() {
    var currentpath = window.location.search;
    var pos = currentpath.indexOf("activity/");
    if (pos >= 0) {
      pos += "activity/".length;
      var pos2 = currentpath.indexOf("/", pos + 1);
      if (pos >= 0 && pos2 >= 0) {
        return currentpath.substr(pos, pos2 - pos);
      }
    }
    return "0";
  },
  
  _openFirstSample: function() {
    var samples = MoonrockSeeSamples.getItems();
    this._setSample(samples[0]);
  },
  
  _setSample: function(sample) {
    if (sample != this._sample) {
      GraphicAnnotation.setEnabled(false);
      var self = this;
      var updateCallback = function() {
        self._sample = sample;
        //VmNavigator.update(sample);
        
        if (sample) {
          var url = sample.snapshot ? sample.snapshot.viewurl :
          (location.protocol + '//' + location.host + location.pathname + sample.vm);
      
          $('#moonrock-vm-iframe').attr('src', url);
          MoonrockVMComm.saluteVm();
        }
        
        for(var i in self._sampleSelectionCallbacks) {
          (self._sampleSelectionCallbacks[i])(self._sample);
        }
      };
    
      console.log((this._sample ? true : false));
      if (this._sample) {
        console.log('getting state for ' + this._sample.id);
        var oldId = this._sample.id;

        var snapshotCallback = function(snapshot) {
          console.log('saving state for ' + oldId);
          MoonrockSeeSamples.setSnapshot(oldId, snapshot)
        };
        MoonrockVMComm.getVMSnapshotAndDoOtherStuffQuick(snapshotCallback, updateCallback);
      } else {
        updateCallback();
      } 
    }
  }
  
};

$(function() {
  MoonrockModules.register('VmManager', VmManager);
});
