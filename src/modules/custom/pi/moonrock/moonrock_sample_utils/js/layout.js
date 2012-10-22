


$(function() {
  var resizeTabs = function() {
    var container = $('.layout-tabbed-container');
    var margin = container.attr('m');
    var content = container.find('.layout-tabbed-container-content.layout-tabbed-container-selected');
    if (content.length > 0) {
      var root = content.find('.layout-root');
      if (root.length > 0) {
        var availableH = $(window).height();
        var availableW = $(window).width();
        var offset = content.offset();
        var w = availableW - offset.left - margin;
        var h = availableH - offset.top - margin;
        container.css('height', h);
        container.css('width', w);
        content.css('height', h);
        content.css('width', w);
        resizeBox(root);
      } 
    }
  };
  
  var selectTab = function(tabId) {
    $('.layout-tabbed-container-tab, .layout-tabbed-container-content').each(function() {
      var _this = $(this);
      if (_this.attr('tab') == tabId) {
        _this.addClass('layout-tabbed-container-selected');
      } else {
        _this.removeClass('layout-tabbed-container-selected');
      }
    });
    
    resizeTabs();
  };
  
  var resizeContent = function(block) {
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
  };
  var resizeBox = function(box) {
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
      resizeContent(block);
    });
  };
  
  selectTab(0);
  $(window).resize(resizeTabs);
  
  $('.layout-tabbed-container-tab').click(function() {
    selectTab($(this).attr('tab'));
  });
});
