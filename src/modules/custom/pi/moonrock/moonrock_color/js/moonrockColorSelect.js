
var MoonrockColorSelect = {

  init: function() {
    var defaultValue = $('[measure_content_type="moonrock_color"]').attr('value');

    $('body').rockColorPicker({
      selectionCallback: function(value, color, name) {
        MoonrockColorSelect.colorSelected(value, color, name);
      },
      opencloseCallback: function(shown) {
        MoonrockColorSelect.setOpenCloseButtons(shown);
      },
      defaultValue:defaultValue
    });

    $('#moonrockColorPickerSelectionColor').click(function() {
      $('body').rockColorPicker('toggle');
    });
    $('#moonrockColorPickerOpen').click(function() {
      $('body').rockColorPicker('open');
    });
    $('#moonrockColorPickerClose').click(function() {
      $('body').rockColorPicker('close');
    });
    $('#moonrockColorPickerClear').click(function() {
      $('body').rockColorPicker('clearSelection', true);
    });
  },
  setOpenCloseButtons: function(pickerShown) {
    if (pickerShown) {
      $('#moonrockColorPickerOpen').hide();
      $('#moonrockColorPickerClose').show();
    } else {
      $('#moonrockColorPickerClose').hide();
      $('#moonrockColorPickerOpen').show();
    }
  },
  colorSelected: function(value, color, name) {
    $('[measure_content_type="moonrock_color"]').attr('value', value);
    if (color) {
      $('#moonrockColorPickerClear').attr("disabled", false);
      $('#moonrockColorPickerSelectionColor').removeClass('moonrockColorPickerSelectionNoColor');
      $('#moonrockColorPickerSelectionColor').css('background', color);
    } else {
      $('#moonrockColorPickerClear').attr("disabled", true);
      $('#moonrockColorPickerSelectionColor').addClass('moonrockColorPickerSelectionNoColor');
    }

    if (name) {
      $('#moonrockColorPickerSelectionNoName').hide();
      $('#moonrockColorPickerSelectionName').html(name).show();
    } else {
      $('#moonrockColorPickerSelectionNoName').show();
      $('#moonrockColorPickerSelectionName').hide();
    }
  }
};

$(function() {
  MoonrockColorSelect.init();
});

