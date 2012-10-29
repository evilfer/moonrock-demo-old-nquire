

var TabsManager = {
  _currentTab: null,
  _currentContent: null,
  _resizeListeners: {},
  
  init: function() {
    this._selectTab('samples');
    
    var self = this;
    $(window).resize(function() {
      self._resizeTabs();
    });
  
    $('.layout-tabbed-container-tab').click(function() {
      var tab = $(this).attr('tab');
      var content = $(this).attr('content');
      if (self._selectTabContent(tab, content)) {
        VmManager.vmTabOpened(tab);
      }
    });
  },
  
  addResizeListener: function(id, callback) {
    this._resizeListeners[id] = callback;
  },
  
  selectTab: function(id) {
    return this._selectTab(id);
  },
  _selectTab: function(id) {
    var element = $('.layout-tabbed-container-tab[tab="' + id + '"]');
    if (element.length > 0) {
      element.removeClass('layout-tabbed-container-hidden');
      var content = element.attr('content');
      return this._selectTabContent(id, content);
    } else {
      return false;
    }
  },
  _selectTabContent: function(tab, content) {
    if (content != this._currentContent) {
      this._currentContent = content;
      $('.layout-tabbed-container-content').each(function() {
        var element = $(this);
        if (element.attr('content') == content) {
          element.addClass('layout-tabbed-container-selected');
        } else {
          element.removeClass('layout-tabbed-container-selected');
        }
      });
    }
    
    this._resizeTabs();


    if (tab != this._currentTab) {
      this._currentTab = tab;
      $('.layout-tabbed-container-tab').each(function() {
        var element = $(this);
        if (element.attr('tab') == tab) {
          element.addClass('layout-tabbed-container-selected');
        } else {
          element.removeClass('layout-tabbed-container-selected');
        }
      });
      return true;
    } else {
      return false;
    }
    
  },
  
  _resizeTabs : function() {
    var container = $('.layout-tabbed-container');
    
    var content = container.find('.layout-tabbed-container-content.layout-tabbed-container-selected');
    if (content.length > 0) {
      var root = content.find('.layout-root');
      if (root.length > 0) {
        var margin = 31;
        var availableH = $(window).height();
        var availableW = $(window).width();
        
        var offset = container.offset();
        var w = availableW - offset.left - margin;
        var h = availableH - offset.top - margin;
        
        container.css('height', h);
        container.css('width', w);
        
        content.css('height', h - 30);
        content.css('width', w);
        this._resizeBox(root);
      } 
    }
    
    for (var i in this._resizeListeners) {
      this._resizeListeners[i]();
    }
  },
 
  
  _resizeContent : function(block) {
    var content = block.children();
    var ow = content.outerWidth(true) - content.width();
    var oh = content.outerHeight(true) - content.height();
    content.css({
      width: block.width() - ow,
      height: block.height() - oh
    });
    
    if (content.hasClass('layout-box')) {
      this._resizeBox(content);
    } else {
      var innerBox = content.find('.layout-box');
      if (innerBox.length > 0) {
        this._resizeBox($(innerBox[0]));
      }
    }
  },
  
  _resizeBox : function(box) {
    var self = this;
    
    var extendDim, flexDim, zeroPos, varPos;
    if (box.hasClass('layout-box-vertical')) {
      extendDim = 'width';
      flexDim = 'height';
      zeroPos = 'left';
      varPos = 'top';
    } else {
      extendDim = 'height';
      flexDim = 'width';
      zeroPos = 'top';
      varPos = 'left';
    }
    
    var extend = box[extendDim]();
    
    var flex = box.children('.layout-block-flex');
    
    if (flex.length > 0) {
      var available = box[flexDim]();
      var used = 0;
      box.children('.layout-block-fixed').each(function() {
        used += $(this)[flexDim]();
      });
        
      var share = (available - used) / flex.length;
      flex.css(flexDim, share);
    }
    
    var pos = 0;
    box.children().each(function() {
      var block = $(this);
      block.css(extendDim, extend);
      block.css(zeroPos, 0);
      block.css(varPos, pos);
      pos += block[flexDim]();
      self._resizeContent(block);
    });
  }
};

$(function() {
  MoonrockModules.register('TabsManager', TabsManager);
});
