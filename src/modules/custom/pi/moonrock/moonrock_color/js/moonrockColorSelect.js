
var MoonrockColorSelect = {

  init: function() {
    var defaultValue = $('[measure_content_type="moonrock_color"]').attr('value');

    $('body').rockColorPicker({
      selectionCallback: function(value, color, name) {
        MoonrockColorSelect.colorSelected(value, color, name);
      },
      defaultValue: defaultValue
    });

    $('#moonrockColorPickerSelectionColor').click(function() {
      $('body').rockColorPicker('toggle');
    });
    $('#moonrockColorPickerSelectionNameClear').click(function() {
      $('body').rockColorPicker('clearSelection', true);
    });
  },
  colorSelected: function(value, color, name) {
    $('[measure_content_type="moonrock_color"]').attr('value', value);
    if (color) {
      $('#moonrockColorPickerSelectionNameClear').removeClass('hidden');
      $('#moonrockColorPickerSelectionColor').removeClass('moonrockColorPickerSelectionNoColor');
      $('#moonrockColorPickerSelectionColor').css('background', color);
    } else {
      $('#moonrockColorPickerSelectionNameClear').addClass('hidden');
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

