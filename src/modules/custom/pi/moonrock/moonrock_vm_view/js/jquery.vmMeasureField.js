


(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        changeCallback: null,
        value: '0',
        id: ''
      }, options);
      
      var self = this;
      self.data('options', _options);
      
      self.html('').addClass('moonrock-measure-field');
      
      $('<div/>')
      .addClass('moonrock-measure-field-value')
      .appendTo(self)
      .html(_options.value);
      
      var buttons = [
      ['[Measure]', 'measure'],
      ['[Clear]', 'clear'],
      ['[Done]', 'done'],
      ['[Cancel]', 'cancel']
      ];
      
      var click = function() {
        self.vmMeasureField('_buttonAction', this.attr('action'));
      };
      
      for (var i in buttons) {
        var button = buttons[i];
        $('<div/>')
        .addClass('moonrock-measure-field-button moonrock-measure-field-button-hidden')
        .appendTo(self)
        .html(button[0])
        .attr('action', button[1])
        .click(click);
      }
      
      this.vmMeasureField('setButtonsIdle');
      return this;
    },
    
    getValue: function() {
      return this.find('.moonrock-measure-field-value').html();
    },    
    setValue: function(value) {
      this.find('.moonrock-measure-field-value').html(value);
      return this;
    },
    
    _buttonAction: function(action) {
      switch(action) {
        case 'measure':
          this.data('backupValue', this.vmMeasureField('getValue')).vmMeasureField('_starMonitoring');
          break;
        case 'done':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('_nofity');
          break;
        case 'cancel':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('setValue', this.data('backupValue'));
          break;
        case 'clear':
          this.vmMeasureField('setValue', '').vmMeasureField('_notify');
          break;
        default:
          break;
      }
      return this;
    },
    
    _setButtonsIdle: function() {
      $('[action="done"], [action="cancel"]').addClass('moonrock-measure-field-button-hidden');
      $('[action="measure"], [action="clear"]').removeClass('moonrock-measure-field-button-hidden');
    },
    _setButtonsEdit: function() {
      $('[action="measure"], [action="clear"]').addClass('moonrock-measure-field-button-hidden');
      $('[action="done"], [action="cancel"]').removeClass('moonrock-measure-field-button-hidden');
    },
    
    _startMonitoring: function() {
      var self = this;
      MoonrockVMComm.monitorMeasureValue(function(value) {
        self.vmMeasureField('setValue', value);
      });
      this.vmMeasureField('_setButtonsEdit');
    },
    _stopMonitoring: function() {
      MoonrockVMComm.stopMeasureValueMonitoring();
      this.vmMeasureField('_setButtonsIdle');
    },
    
    _notify: function() {
      var options = this.data('options');
      if (options.changeCallback) {
        options.changeCallback(this.getValue());
      }
      return this;
    }
  };


  $.fn.vmMeasureField = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.vmMeasureField');
      return false;
    }
  };
})(jQuery);
