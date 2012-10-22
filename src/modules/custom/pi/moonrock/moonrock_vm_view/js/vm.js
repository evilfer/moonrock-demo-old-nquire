

var VmManager = {
  _sample: null,
  
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
    TabsManager.selectTab(1);
  },
  
  vmTabOpened: function() {
    if (! this._sample) {
      this._openFirstSample();
    }
  },
  
  _openFirstSample: function() {
    var samples = MoonrockSeeSamples.getItems();
    this._setSample(samples[0]);
  },
  
  _setSample: function(sample) {
    var self = this;
    var updateCallback = function() {
      self._sample = sample;
      VmNavigator.update(sample);
      
      var url = sample.snapshot ? sample.snapshot.viewurl :
      (location.protocol + '//' + location.host + location.pathname + sample.vm);
      
      $('#moonrock-vm-iframe').attr('src', url);
    };
    
    if (this._sample) {
      var oldId = this._sample.id;

      var snapshotCallback = function(snapshot) {
        MoonrockSeeSamples.setSnapshot(oldId, snapshot)
      };
      MoonrockVMComm.getVMSnapshotAndDoOtherStuffQuick(snapshotCallback, updateCallback);
    } else {
      updateCallback();
    } 
  },
  
  _saveCurrentSampleState: function() {
    
  }
};

$(function() {
  VmManager.init();
});
