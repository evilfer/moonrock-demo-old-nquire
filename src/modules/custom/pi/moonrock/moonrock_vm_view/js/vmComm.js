

var MoonrockVMComm = {
  _activityId: null,
  _snapshotCallback: null,
  _snapshot: null,
  _vmUpdatingPosition: false,
  
  _vmPositionMonitors: {},
  _vmMeasureMonitors: {},
  _getPositionCallback: null,
    
  init: function() {
    var self = this;
    window.addEventListener("message", function(event) {
      self._receiveMessage(event);
    }, false);
  },
  
  iframeLoaded: function() {
    var self = this;
    setTimeout(function() {
      self._post('monitor', 'PositionPixels');
      self._post('monitor', 'MeasureMM');
    }, 500);
  },
  saluteVm: function() {
    this._probing = true;
    var self = this;
    
    var schedule = function() {
      setTimeout(probe, 10);
    };
    var probe = function() {
      if (self._probing) {
        console.log('probing');
        self._post('list');
        schedule();
      }
    };
    
    schedule();
  },
  
  addPositionChangeListener: function(id, callback) {
    this._vmPositionMonitors[id] = callback;
  },
  removePositionChangeListener: function(id) {
    delete this._vmPositionMonitors[id];
  },
  
  addMeasureValueListener: function(id, callback) {
    this._post('set', 'FeatureState', {
      measure: true
    });
    
    this._vmMeasureMonitors[id] = callback;
  },
  removeMeasureValueListener: function(id) {
    delete this._vmMeasureMonitors[id];
    this._post('set', 'FeatureState', {
      measure: false
    });
  },
  
  
  prepareForPositionUpdate: function() {
    this._vmUpdatingPosition = true;
  },
  
  setVMParams: function(params) {
    this._vmUpdatingPosition = true;
    var value = JSON.parse(params);
    value.zoom = Math.max(0, value.zoom);
    this._post('set', 'PositionPixels', value);
  },

  _notifyPosition: function(content) {
    for (var id in this._vmPositionMonitors) {
      this._vmPositionMonitors[id](content);
    }
  },
  _receiveMessage: function(event) {
    var self = this;
    var msg = event.data;
    switch(msg.action) {
      case 'list':
        if (self._probing) {
          console.log('vm answered');
          self._probing = false;
          self.iframeLoaded();
        }
        break;
      case 'monitor':
        switch( (msg.param)) {
          case 'PositionPixels':
            if (msg.content) {
              self._notifyPosition(msg.content);
            } else {
              self._getPositionCallback = function(content) {
                self._notifyPosition(content);
              }
              self._post('get', 'PositionPixels');
            }
            break;
          case 'MeasureMM':
            if (self._vmMeasureMonitor && msg.content && typeof msg.content.distance !== 'undefined') {
              this._vmMeasureMonitor(msg.content.distance);
            }
            break;
        }
        break;
      case 'get':
        switch (msg.param) {
          case 'viewURL':
            var url = msg.content;
            var a = url.indexOf('?');
            var b = url.lastIndexOf('?');
            if (a >0 && b > 0) {
              url = url.substr(0, a) + url.substr(b);
            }
            self._snapshot.viewurl = url;
            self._post('get', 'PositionPixels');
            break;
          case 'PositionPixels':
            if (self._getPositionCallback == null) {
              self._snapshot.position = JSON.stringify(msg.content);
              self._post('get', 'Snapshot', {});
            } else {
              var callback = self._getPositionCallback;
              self._getPositionCallback = null;
              callback(msg.content);
            }
            break;
          case 'Snapshot':
            var image = new Image();
            image.onload = function() {
              var _width = 300;
              var ratio = parseFloat(this.height) / this.width;
              var height = ratio * _width;
      
              var resizeCanvas = $('#moonrock-vm-resize-canvas')[0];
              resizeCanvas.width = _width;
              resizeCanvas.height = height;

              resizeCanvas.getContext("2d").drawImage(this, 0, 0, _width, height);
              self._snapshot.image = resizeCanvas.toDataURL();
              var callback = self._snapshotCallback;
              self._snapshotCallback = null;
              callback(self._snapshot);
            };
            
            if (self._otherStuffCallback) {
              self._otherStuffCallback();
            }
    
            image.src = msg.content;
            break;
        }
        break;
      case 'set':
        switch (msg.param) {
          case 'PositionPixels':
            this._vmUpdatingPosition = false;
            if (this._vmSetCompletedCallback) {
              this._vmSetCompletedCallback();
              this._vmSetCompletedCallback = null;
            }
            break;
        }
        break;
    }
  },
  
  _post: function(action, param, value) {
    var iframe = $('#moonrock-vm-iframe')[0].contentWindow;
    var msg = {
      action: action
    };
    /*    if (this._activityId !== null) {
      msg.activityId = this._activityId;
    }-*/
    if (action !== 'list') {
      msg.activityId = 0;
    }
    
    if (typeof(param) !== 'undefined') {
      msg.param = param;
    }
    
    if (value) {
      msg.value = value;
    }
    
    if(iframe && iframe.postMessage) {
      iframe.postMessage(msg, location.href);
    //      iframe.postMessage(msg, location.origin);
    } else {
      console.log('ERROR: Messaging is not available');
    }
  },
  
  getVMSnapshot: function(callback) {
    this._snapshotCallback = callback;
    this._otherStuffCallback = null;
    this._snapshot = {
      vm_parameters: null,
      image: null
    };
    
    this._post('get', 'viewURL');
  },
  
  getVMSnapshotAndDoOtherStuffQuick: function(snapshotCallback, otherStuffCallback) {
    this._snapshotCallback = snapshotCallback;
    this._otherStuffCallback = otherStuffCallback;
    this._snapshot = {
      vm_parameters: null,
      image: null
    };
    
    this._post('get', 'viewURL');
  }
};

$(function() {
  MoonrockModules.register('MoonrockVMComm', MoonrockVMComm);
});
