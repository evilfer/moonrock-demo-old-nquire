


(function($) {

  var methods = {
    init : function(options) {
      var _options = $.extend({
        changeCallback: null
      }, options);
      
      var self = this;
      self.data('options', _options);
      
      self.html('').addClass('moonrock-measure-field');
      
      var display = $('<div/>')
      .addClass('moonrock-measure-field-value')
      .attr('op', 'measure')
      .appendTo(self);
      
      self.vmMeasureField('_field2displayValue');
      
      var buttons = [
      ['Measure', 'measure'],
      ['Clear', 'clear'],
      ['Done', 'done'],
      ['Cancel', 'cancel']
      ];
      
      var click = function(event) {
        self.vmMeasureField('_buttonAction', $(this).attr('op'));
        event.stopPropagation();
        event.preventDefault();
        return false;
      };
      
      display.click(click);
      
      for (var i in buttons) {
        var button = buttons[i];
        $('<button/>')
        .addClass('moonrock-measure-field-button moonrock-measure-field-button-hidden')
        .appendTo(self)
        .html(button[0])
        .attr('op', button[1])
        .click(click);
      }
      
      this.vmMeasureField('_setButtonsIdle');
      return this;
    },
    
    getDisplayValue: function() {
      return this.data('displayValue');
    },    
    setValue: function(value) {
      this
      .vmMeasureField('_setDisplayValue', value)
      .vmMeasureField('_setFieldValue', value)
      .vmMeasureField('_setButtonsIdle');
      
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
    hasValue: function() {
      return this.length > 0 && this.vmMeasureField('getDisplayValue').length > 0;
    },

    _setDisplayValue: function(value) {
      this.data('displayValue', value);
      var element = this.find('.moonrock-measure-field-value');
      var text = '' + value;
      if (text.length == 0) {
        element.addClass('empty').html('Click here to start measuring!');
      } else {
        element.removeClass('empty').html(value);
      }
      
      return this;
    },
    _display2fieldValue: function() {
      this.vmMeasureField('_setFieldValue', this.vmMeasureField('getDisplayValue'));
      return this;
    },
    _field2displayValue: function() {
      this.vmMeasureField('_setDisplayValue', this.vmMeasureField('_getFieldValue'));
      this.vmMeasureField('_setButtonsIdle');

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
          this.vmMeasureField('_startMonitoring').vmMeasureField('_notify', 'start');
          break;
        case 'done':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('_display2fieldValue').vmMeasureField('_notify', 'done');
          break;
        case 'cancel':
          this.vmMeasureField('_stopMonitoring').vmMeasureField('_field2displayValue');
          break;
        case 'clear':
          this.vmMeasureField('setValue', '').vmMeasureField('_notify', 'done');
          break;
        default:
          break;
      }
      return this;
    },
    
    _setButtonsIdle: function() {
      this.find('.moonrock-measure-field-button[op="done"], .moonrock-measure-field-button[op="cancel"]').addClass('moonrock-measure-field-button-hidden');
      this.find('.moonrock-measure-field-button[op="measure"]').removeClass('moonrock-measure-field-button-hidden');
      
      if (this.vmMeasureField('hasValue')) {
        this.find('.moonrock-measure-field-button[op="clear"]').removeClass('moonrock-measure-field-button-hidden');
      } else {
        this.find('.moonrock-measure-field-button[op="clear"]').addClass('moonrock-measure-field-button-hidden');
      }      
      return this;
    },
    _setButtonsEdit: function() {
      this.find('.moonrock-measure-field-button[op="measure"], .moonrock-measure-field-button[op="clear"]').addClass('moonrock-measure-field-button-hidden');
      this.find('.moonrock-measure-field-button[op="done"], .moonrock-measure-field-button[op="cancel"]').removeClass('moonrock-measure-field-button-hidden');
      return this;
    },
    
    _startMonitoring: function() {
      var self = this;
      MoonrockVMComm.addMeasureValueListener('measurefield', function(value) {
        self.vmMeasureField('_setDisplayValue', value).vmMeasureField('_notify', 'change');
      });
      this.vmMeasureField('_setButtonsEdit');
      return this;
    },
    _stopMonitoring: function() {
      MoonrockVMComm.removeMeasureValueListener('measurefield');
      this.vmMeasureField('_setButtonsIdle');
      return this;
    },
    
    _notify: function(op) {
      var options = this.data('options');
      if (options.changeCallback) {
        options.changeCallback(op);
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
