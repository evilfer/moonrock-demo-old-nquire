

var MoonrockVMComm = {
  _iframe: null,
  _activityId: null,
  _snapshotCallback: null,
  _snapshot: null,
  _vmPositionMonitor: null,
  _vmPositionMessageValid: false,
  _vmUpdatingPosition: false,
  
 
  
  init: function() {
    console.log('MoonrockDataInputVM');
    
    var self = this;
    window.addEventListener("message", function(event) {
      self._receiveMessage(event);
    }, false);
    
    MoonrockVmViewManager.addVMLoadedCallback(function() {
      self.iframeLoaded();
    });
  },
  
  monitorPositionChange: function(callback) {
    this._vmPositionMessageValid = false;
    this._vmPositionMonitor = callback;
    this._post('monitor', 'PositionPixels');
  },
  stopPositionMonitoring: function() {
    this._vmPositionMonitor = null;
  },
  
  monitorMeasureValue: function(callback) {
    this._post('set', 'FeatureState', {
      measure: true
    });
    this._post('monitor', 'MeasureMM');
    this._vmMeasureMonitor = callback;
  },
  stopMeasureValueMonitoring: function() {
    this._vmMeasureMonitor = null;
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
  
  /*  iframeLoaded: function(window) {
    this._activityId = null;
    this._iframe = window;
    this._post('list');
    this._post('monitor', 'PositionPixels');
  },*/
  _fire: function(event, params) {
    if (this._vmListener && this._vmListener[event]) {
      (this._vmListener[event])(params);
    }
  },
  _receiveMessage: function(event) {
    var self = this;
    var msg = event.data;
    switch(msg.action) {
      case 'list':
        self._activityId = msg.content[0].id;
        self._fire('vmready');
        break;
      case 'monitor':
        switch( (msg.param)) {
          case 'PositionPixels':
            if (this._vmPositionMessageValid) {
              if (self._vmPositionMonitor) {
                this._vmPositionMonitor(msg.content);
              }
            } else {
              this._vmPositionMessageValid = true;
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
            self._snapshot.viewurl = msg.content;
            self._post('get', 'PositionPixels');
            break;
          case 'PositionPixels':
            self._snapshot.position = JSON.stringify(msg.content);
            self._post('get', 'Snapshot', {});
            break;
          case 'Snapshot':
            var image = new Image();
            image.onload = function() {
              var _width = 300;
              var ratio = parseFloat(this.height) / this.width;
              var height = ratio * _width;
      
              var resizeCanvas = $('#moonrock-samples-page-vm-resize-canvas')[0];
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
    var iframe = $('#moonrock-samples-page-vm-iframe')[0].contentWindow;
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
      iframe.postMessage(msg, iframe.location.href);
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
  MoonrockVMComm.init();
});
