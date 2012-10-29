
var AnnotationTransform = {
  _sectionSize: null,
  _element: null,
  _pos: null,
  _vmCenterRelPos: {
    dx: 0,
    dy: 0
  },
  _viewSize: {
    width: 0,
    height: 0,
    cx: 0,
    cy: 0
  },
  _zeroZoomScale: 0,
  
  
  init: function() {
    this._element = $('#annotation');
  },
  
  vmLoaded: function() {
    this._initVmAndZeroZoomScale();
  },
  
  _initVmAndZeroZoomScale: function() {
    var url = $('#moonrock-vm-iframe').attr('src');
    var a = url.indexOf('HTML5VM/') + 'HTML5VM/'.length;
    var b = url.indexOf('/', a);
    this._id = url.substr(a, b - a);
    this._sectionSize = MoonrockVmSizeData.get(this._id);
    
    this._resize();
    
    var wk = (this._viewSize.width - 30) / this._sectionSize.width;
    var hk = (this._viewSize.height - 70) / this._sectionSize.height;
    this._zeroZoomScale = Math.min(wk, hk);
  },

  
  resize: function() {
    console.log('transform resize');
    
    this._resize();
    if (this._pos) {
      this._update();
    }
  },
  
  setVmPos: function(vmPos) {
    this._pos = vmPos;
    this._vmCenterRelPos.dx = vmPos.x - .5 * this._sectionSize.width;
    this._vmCenterRelPos.dy = vmPos.y - .5 * this._sectionSize.height;
    
    this._update();
  },  
  
  _resize: function() {    
    this._viewSize.width = this._element.width();
    this._viewSize.height = this._element.height();
    this._viewSize.cx = .5 * this._viewSize.width;
    this._viewSize.cy = .5 * this._viewSize.height - 20;
  },
  
  
  _update: function() {
    this._updateScale();
    this._updateTransform();
  },
  _updateScale: function() {
    this._vm2canvas = this._pos.zoom + this._zeroZoomScale * (1 - this._pos.zoom);
    this._canvas2vm = 1. / this._vm2canvas;
  },
  _updateTransform: function() {
    var transform = 
    'translate(' + (this._viewSize.cx) + ' ' + (this._viewSize.cy) + ') ' +
    'scale(' + this._vm2canvas + ')' + 
    'translate(' + (-this._vmCenterRelPos.dx) +  ' ' + (-this._vmCenterRelPos.dy) + ') ' +
    '';
    
    console.log(transform);
    GraphicAnnotation._setTransform(transform);
  },
  
  getVmPoint: function(x, y) {
    return {
      x: (x - this._viewSize.cx) * this._canvas2vm + this._vmCenterRelPos.dx,
      y: (y - this._viewSize.cy) * this._canvas2vm + this._vmCenterRelPos.dy
    };
  },
  
  getVmPointForPolyline: function(x, y) {
    return [
    (x - this._viewSize.cx) * this._canvas2vm + this._vmCenterRelPos.dx,
    (y - this._viewSize.cy) * this._canvas2vm + this._vmCenterRelPos.dy
    ];
  }
};

$(function() {
  MoonrockModules.register('AnnotationTransform', AnnotationTransform, ['MoonrockVMComm', 'MoonrockVmSizeData']);
});
