

var GraphicAnnotation = {
  _element: null,
  _svg: null,
  _group: null,
  _enabled: false,
  _action: null,
  _currentPolyline: null,
  _currentPointList: null,
  _currentAnnotation: null,
  _buttonDown: false,
  _mode: 'blue',
  _changeListeners: {},
  
  init: function() {
    if (GraphicAnnotation.isTablet()) {
      $('#annotation-svg').addClass('annotation-svg-hidden');
    } else {
      var self = this;
      this._element = $('#annotation-svg');
      this._parent = this._element.parent();
      $('.annotation-buttons > .annotation-mode-selector').click(function() {
        self._setMode($(this).attr('mode'));
      });
    
      $('#annotation-done').click(function() {
        self._done();
      });
      $('#annotation-cancel').click(function() {
        self._cancel();
      });
    
    
      this._element.svg({
        onLoad: function(svg) { 
          self._svg = svg; 
          self._group = svg.group(); 
        
          self._element.customMouseInput('rawdrag', function(action, point) {
            if (self._enabled) {
              switch(action) {
                case 'dragstart':
                  self.startDrag(point);
                  break;
                case 'drag':
                  self.drag(point);
                  break;
                case 'dragend':
                  self.endDrag();
                  break;
              }
            }
          });
        }
      }); 
    
      MoonrockVMComm.addVmAvailableListener('annotation', function(available) {
        if (available) {
          AnnotationTransform.vmLoaded();
          self._element.show();
        } else {
          self._element.hide();
        }
      });
    
      MoonrockVMComm.addPositionChangeListener('annotation', function(pos) {
        AnnotationTransform.setVmPos(pos);
      });
    
      TabsManager.addResizeListener('annotation', function() {
        self._element.attr({
          width: self._parent.width(),
          height: Math.max(0, self._parent.height() - 40)
        });
        AnnotationTransform.resize();
      });
    
    
      self.setEnabled(false);
    }
  },
  
  addChangeListener: function(id, callback) {
    this._changeListeners[id] = callback;
  },
  _done: function() {
    this.setEnabled(false);
    this._createAnnotation();
    this._notify('done');
  },
  _cancel: function() {
    this.setEnabled(false);
    this.importAnnotation(this._currentAnnotation);
    this._notify('cancel');
  },
  _notify: function(action) {
    for(var i in this._changeListeners) {
      this._changeListeners[i](action);
    }
  },
  
  acceptCurrentValue: function() {
    this.setEnabled(false);
    this._createAnnotation();
  },
  isTablet : function() {
    return navigator.userAgent.match(/iPad|Android/i);
  },
  
  setEnabled: function(enabled) {
    this._enabled = enabled;
    if (enabled) {
      $('.annotation-root-element').removeClass('annotation-inactive');
      this._setMode('blue');
    } else {
      $('.annotation-root-element').addClass('annotation-inactive');
    }
  },
  
  _setMode: function(mode) {
    $('.annotation-buttons > .annotation-mode-selector').each(function() {
      if ($(this).attr('mode') == mode) {
        $(this).addClass('annotation-mode-selected');
      } else {
        $(this).removeClass('annotation-mode-selected');
      }
    });
    this._mode = mode;
  },
  
  _setTransform: function(transform) {
    $(this._group).attr('transform', transform);
  },
  
  clear: function() {
    if (this._group) {
      while (this._group.childElementCount > 0) {
        var polyline = this._group.childNodes[0];
        this._group.removeChild(polyline);
      }
    }
  },
  _createAnnotation: function() {
    var obj = [];
    for (var i = 0; i < this._group.childElementCount; i++) {
      var polyline = this._group.childNodes[i];
      obj.push({
        points: polyline.getAttribute('points'),
        color: polyline.getAttribute('stroke')
      });
    }
    
    this._currentAnnotation = JSON.stringify(obj);    
  },
  getCurrentAnnotation: function() {
    return this._currentAnnotation;
  },
  
  importAnnotation: function(annotation) {
    this.clear();
    this._currentAnnotation = annotation;
    if (annotation) {
      var array = JSON.parse(annotation);
      for (var i in array) {
        var line = array[i];
        var pointwords = line.points.split(' ');
        var points = [];
        for (var j = 0; j < pointwords.length; j++) {
          var p = pointwords[j];
          var ps = p.split(',');
          if (ps.length == 2) {
            points.push([parseFloat(ps[0]), parseFloat(ps[1])]);
          }
        }
        this._createPolyline(points, line.color);
      }
    }
  },
  
  getPoint: function(eventPoint) {
    var offset = this._element.offset();
    return AnnotationTransform.getVmPointForPolyline(eventPoint.x - offset.left, eventPoint.y - offset.top);
  },  
  startDrag: function(eventPoint) {
    this._buttonDown = true;
    
    var point = this.getPoint(eventPoint);
    if (this._mode == 'erase') {
      this._lastErasePoint = point;
    } else {
      this._currentPointList = [point];
      this._currentPolyline = null;
    }
  },
  endDrag: function() {
    this._buttonDown = false;
    this._currentPointList = null;
    this._currentPolyline = null;
    this._lastErasePoint = null;
  },
  drag: function(eventPoint) {
    if (this._buttonDown) {
      var point = this.getPoint(eventPoint);
      if (this._mode == 'erase') {
        this.erase(point);
      } else if (this._currentPointList) {
        this._currentPointList.push(point);
        if (this._currentPolyline) {
          this._group.removeChild(this._currentPolyline);
        }
        this._currentPolyline = this._createPolyline(this._currentPointList, this._mode);
      }
      
      this._notify('change');
    }
  },
  erase: function(point) {
    for (var i = 0; i < this._group.childElementCount; i++) {
      var polyline = this._group.childNodes[i];
      var points = polyline.points;
      var n = points.numberOfItems - 1;
      for (var j = 0; j < n; j++) {
        var p0 = this._toArrayPoint(points.getItem(j));
        var p1 = this._toArrayPoint(points.getItem(j + 1));
        if (this._intersect(this._lastErasePoint, point, p0, p1)) {
          this._group.removeChild(polyline);
          break;
        }
      }
    }
    this._lastErasePoint = point;
  },
  _createPolyline: function(points, mode) {
    return this._svg.polyline(this._group, points, {
      fill: 'none',
      stroke: mode,
      strokeWidth: 20,
      style: 'stroke-linecap: round; stroke-linejoin: round'
    });
  },
  _toArrayPoint: function(xyp) {
    return [xyp.x, xyp.y];
  },
  
  _intersect: function(a, b, c, d) {
    return this._lineSegmentIntersect(a, b, c, d) && 
    this._lineSegmentIntersect(c, d, a, b);
  },
  _lineSegmentIntersect: function(a, b, c, d) {
    var AB = this._segment(a, b);
    var AC = this._segment(a, c);
    var AD = this._segment(a, d);
    return this._cross(AB, AC) * this._cross(AB, AD) <= 0;
  },
  _segment: function(a, b) {
    return [b[0]-a[0], b[1]-a[1]];
  },
  _cross: function(A, B) {
    return A[0]*B[1]-A[1]*B[0];
  }
}

$(function() {
  MoonrockModules.register('GraphicAnnotation', GraphicAnnotation, ['MoonrockVMComm', 'AnnotationTransform', 'TabsManager']);
});
