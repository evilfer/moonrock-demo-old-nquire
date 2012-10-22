

var TabsManager = {
  init: function() {
    this._selectTab(0);
    
    var self = this;
    $(window).resize(function() {
      self._resizeTabs();
    });
  
    $('.layout-tabbed-container-tab').click(function() {
      self._selectTab($(this).attr('tab'));
    });
  },
  
  _resizeTabs : function() {
    var container = $('.layout-tabbed-container');
    
    var content = container.find('.layout-tabbed-container-content.layout-tabbed-container-selected');
    if (content.length > 0) {
      var root = content.find('.layout-root');
      if (root.length > 0) {
        var availableH = $(window).height();
        var availableW = $(window).width();
        var offset = content.offset();
        var w = availableW - offset.left - 20;
        var h = availableH - offset.top - 17;
        container.css('height', h);
        container.css('width', w);
        content.css('height', h - 20);
        content.css('width', w - 5);
        this._resizeBox(root);
      } 
    }
  },
  
  selectTab: function(tabId) {
    this._selectTab(tabId);
  },
  
  _selectTab : function(tabId) {
    if ($('.layout-tabbed-container-selected[tab="' + tabId + '"]').length == 0) {
      $('.layout-tabbed-container-tab, .layout-tabbed-container-content').each(function() {
        var _this = $(this);
        if (_this.attr('tab') == tabId) {
          _this.addClass('layout-tabbed-container-selected');
        } else {
          _this.removeClass('layout-tabbed-container-selected');
        }
      });
    
      this._resizeTabs();
      
      if (tabId == 1) {
        VmManager.vmTabOpened();
      }
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
      resizeBox(content);
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
  TabsManager.init();
});
