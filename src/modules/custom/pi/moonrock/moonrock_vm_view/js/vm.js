

var VmManager = {
  _sample: null,
  _sampleSelectionCallbacks: [],
  _updatingSample: false,
  init: function() {
    var self = this;
    MoonrockSeeSamples.addCallback(function(type, item) {
      if (type === 'imgclick') {
        self.sampleSelected(item);
      }
    });

    TabsManager.addResizeListener('vm', function(fullscreenToggled) {
      $('#moonrock-vm-iframe').resize();
    });

    MoonrockVMComm.addVmAvailableListener('vm', function(available) {
      TabsManager.enable();
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
  getActivityId: function() {
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
  _setSample: function(sample, forceReload) {
    if (sample != this._sample || forceReload) {
      GraphicAnnotation.setEnabled(false);
      var self = this;
      TabsManager.disable();

      var updateCallback = function() {
        console.log('loading sample...');
        self._sample = sample;

        if (sample) {
          var url = sample.snapshot ? sample.snapshot.viewurl :
                  (location.protocol + '//' + location.host + location.pathname + sample.vm);

          $('#moonrock-vm-iframe').attr('src', url);
          MoonrockVMComm.saluteVm();
        }

        for (var i in self._sampleSelectionCallbacks) {
          (self._sampleSelectionCallbacks[i])(self._sample);
        }
      };

      if (this._sample && !self._updatingSample) {
        self._updatingSample = this._sample.id;
        console.log('getting state for ' + this._sample.id);

        var snapshotCallback = function(snapshot) {
          console.log('saving state for ' + self._updatingSample);
          MoonrockSeeSamples.setSnapshot(self._updatingSample, snapshot);
          self._updatingSample = false;
        };

        MoonrockVMComm.getVMSnapshotAndDoOtherStuffQuick(snapshotCallback, updateCallback);
      } else {
        updateCallback();
      }
    }
  }

};

$(function() {
  MoonrockModules.register('VmManager', VmManager, ['TabsManager']);
});
