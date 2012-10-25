

var GraphicAnnotation = {
  _element: null,
  _svg: null,
  _group: null,
  _action: null,
  _lastPoint: null,
  _currentPath: null,
  _currentPointList: null,
  _buttonDown: false,
  _mode: 'blue',
  
  init: function() {
    $('.othercontent').click(function() {
      alert('clicked on green');
    });
    
    var self = this;
    this._element = $('#annotation-canvas');
    $('.annotation-buttons > .mode-selector').click(function() {
      self._mode = $(this).attr('mode');
    });
    
    $('#annotation-on').click(function() {
      $('#annotation').removeClass('annotation-inactive');
    });
    $('#annotation-off').click(function() {
      $('#annotation').addClass('annotation-inactive');
    });
    
    
    this._element.svg({
      onLoad: function(svg) { 
        self._svg = svg; 
        self._group = svg.group(); 
        
        self._element.mousedown(function(event) {
          self.startDrag(event);
          event.preventDefault();
          event.stopPropagation();
          return false;
        }).mousemove(function(event) {
          self.drag(event);
          event.preventDefault();
          event.stopPropagation();
          return false;
        }).mouseup(function(event) {
          self.endDrag();
          event.preventDefault();
          event.stopPropagation();
          return false;
        });
      }
    }); 
    
    MoonrockVMComm.iframeLoaded();
    
    MoonrockVMComm.monitorPositionChange('annotation', function(pos) {
      AnnotationTransform.setVmPos(pos);
    });
  },
  
  _setTransform: function(transform) {
    $(this._group).attr('transform', transform);
  },
  
  getPoint: function(event) {
    var offset = this._element.offset();
    return AnnotationTransform.getVmPoint(event.pageX - offset.left, event.pageY - offset.top);
  },
  startDrag: function(event) {
    /*this._currentPointList = [this.getPathPoint(event)];
    this._currentPath = this._svg.polyline(this._surface, this._currentPointList, {
      fill: 'none',
      stroke: 'red',
      strokeWidth: 3
    });*/
    this._buttonDown = true;
    var point = this.getPoint(event);
    if (this._mode == 'erase') {
      this.erase(point);
    } else {
      this._lastPoint = point;
    }
  },
  endDrag: function() {
    this._buttonDown = false;
    this._lastPoint = null;
  //this._currentPath = null;
  },
  drag: function(event) {
    if (this._buttonDown) {
      var point = this.getPoint(event);
      if (this._mode == 'erase') {
        this.erase(point);
      } else if (this._lastPoint) {
        this._svg.line(this._group, this._lastPoint.x, this._lastPoint.y, point.x, point.y, {
          stroke: this._mode,
          strokeWidth: 20,
          fill: 'none'
        });
        this._lastPoint = point;
      }
    }/*
    if (this._currentPath) {
      this._currentPath.points.appendItem(this.getPathPoint(event));
    }*/
  },
  erase: function(point) {
    for (var i = 0; i < this._group.childElementCount; i++) {
      var line = this._group.childNodes[i];
      var x = .5 * (parseInt(line.getAttribute('x1')) + parseInt(line.getAttribute('x2')));
      var y = .5 * (parseInt(line.getAttribute('y1')) + parseInt(line.getAttribute('y2')));
      if (Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10) {
        this._group.removeChild(line);
      }
    }
  }
  
}

$(function() {
  GraphicAnnotation.init();
});
