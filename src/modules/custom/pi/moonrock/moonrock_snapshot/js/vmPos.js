
var AnnotationTransform = {
  data: {
    '14053' : {
      "width": 12831,
      "height": 6407
    }
  },
  
  _element: null,
  _pos: null,
  _viewSize: {
    width: 0,
    height: 0
  },
  _zeroZoomScale: 0,
  
  
  init: function() {
    this._element = $('#annotation');
    this._resize();
  },
  
  resize: function() {
    this._resize();
    this._update();
  },
  
  setVmPos: function(vmPos) {
    this._pos = vmPos;
    this._update();
  },  
  
  _resize: function() {
    var url = $('#moonrock-vm-iframe').attr('src');
    var a = url.indexOf('HTML5VM/') + 'HTML5VM/'.length;
    var b = url.indexOf('/', a);
    this._id = url.substr(a, b - a);
    this._viewSize.width = this._element.width();
    this._viewSize.height = this._element.height();
  },
  
  
  _update: function() {
    this._updateZeroZoomScale();
    this._updateScale();
    this._updateTransform();
  },
  _updateZeroZoomScale: function() {
    var size = this.data[this._id];
    var wk = (this._viewSize.width - 30) / size.width;
    var hk = (this._viewSize.height - 30) / size.height;
    this._zeroZoomScale = Math.min(wk, hk);
  },
  _updateScale: function() {
    this._vm2canvas = this._pos.zoom + this._zeroZoomScale * (1 - this._pos.zoom);
    this._canvas2vm = 1. / this._vm2canvas;
  },
  _updateTransform: function() {
    var transform = 
      'translate(' + (.5 * this._viewSize.width) + ' ' + (.5 * this._viewSize.height) + ') ' +
      'scale(' + this._vm2canvas + ')' + 
      'translate(' + (-this._pos.x + .5 * this.data[this._id].width) +  ' ' + (-this._pos.y + .5 * this.data[this._id].height) + ') ' +
      '';
    
    console.log(transform);
    GraphicAnnotation._setTransform(transform);
  },
  
  getVmPoint: function(x, y) {
    return {
      x: (x - .5 * this._viewSize.width) * this._canvas2vm + this._pos.x - .5 * this.data[this._id].width,
      y: (y - .5 * this._viewSize.height) * this._canvas2vm + this._pos.y - .5 * this.data[this._id].height
    };
  }
};

$(function() {
  AnnotationTransform.init();
});
