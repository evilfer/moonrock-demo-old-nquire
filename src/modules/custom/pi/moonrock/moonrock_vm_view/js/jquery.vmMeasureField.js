


(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        changeCallback: null
      }, options);
      
      var self = this;
      self.data('options', _options);
      
      self.html('').addClass('moonrock-measure-field');
      
      $('<div/>')
      .addClass('moonrock-measure-field-value')
      .appendTo(self);
      
      self.vmMeasureField('_field2displayValue');
      
      var buttons = [
      ['[Measure]', 'measure'],
      ['[Clear]', 'clear'],
      ['[Done]', 'done'],
      ['[Cancel]', 'cancel']
      ];
      
      var click = function() {
        self.vmMeasureField('_buttonAction', $(this).attr('action'));
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
      
      this.vmMeasureField('_setButtonsIdle');
      return this;
    },
    
    getDisplayValue: function() {
      return this.find('.moonrock-measure-field-value').html();
    },    
    setValue: function(value) {
      this
      .vmMeasureField('_setDisplayValue', value)
      .vmMeasureField('_setFieldValue', value);
      return this;
    },
    fieldValueUpdated: function() {
      this.vmMeasureField('_stopMonitoring');
      this.vmMeasureField('_field2displayValue');
      return this;
    },
    acceptCurrentMeasure: function() {
      this
      .vmMeasureField('_stopMonitoring')
      .vmMeasureField('_display2fieldValue');
      return this;
    },

    _setDisplayValue: function(value) {
      this.find('.moonrock-measure-field-value').html(value);
      return this;
    },
    _display2fieldValue: function() {
      this.vmMeasureField('_setFieldValue', this.vmMeasureField('getDisplayValue'));
      return this;
    },
    _field2displayValue: function() {
      this.vmMeasureField('_setDisplayValue', this.vmMeasureField('_getFieldValue'));
      return this;
    },
    _setFieldValue: function(value) {
      var key = this.attr('vm_measure');
      $('input[vm_measure="' + key + '"]').val(value);
      return this;
    },
    _getFieldValue: function() {
      var key = this.attr('vm_measure');
      return $('input[vm_measure="' + key + '"]').val();
    },
    
    _buttonAction: function(action) {
      switch(action) {
        case 'measure':
          this.vmMeasureField('_startMonitoring');
          break;
        case 'done':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('_display2fieldValue').vmMeasureField('_notify', true);
          break;
        case 'cancel':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('_field2displayValue');
          break;
        case 'clear':
          this.vmMeasureField('setValue', '').vmMeasureField('_notify', true);
          break;
        default:
          break;
      }
      return this;
    },
    
    _setButtonsIdle: function() {
      $('[action="done"], [action="cancel"]').addClass('moonrock-measure-field-button-hidden');
      $('[action="measure"], [action="clear"]').removeClass('moonrock-measure-field-button-hidden');
      return this;
    },
    _setButtonsEdit: function() {
      $('[action="measure"], [action="clear"]').addClass('moonrock-measure-field-button-hidden');
      $('[action="done"], [action="cancel"]').removeClass('moonrock-measure-field-button-hidden');
      return this;
    },
    
    _startMonitoring: function() {
      var self = this;
      MoonrockVMComm.monitorMeasureValue(function(value) {
        self.vmMeasureField('_setDisplayValue', value).vmMeasureField('_notify', false);
      });
      this.vmMeasureField('_setButtonsEdit');
      return this;
    },
    _stopMonitoring: function() {
      MoonrockVMComm.stopMeasureValueMonitoring();
      this.vmMeasureField('_setButtonsIdle');
      return this;
    },
    
    _notify: function(complete) {
      var options = this.data('options');
      if (options.changeCallback) {
        options.changeCallback(complete);
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
