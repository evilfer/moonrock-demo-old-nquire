
$(function() {
  var colors = [];
  for(var color in MoonrockColorKeys) {
    colors.push(color.substr(1));
  }
  var defaultcolor = $('[measure_content_type="moonrock_color"]').attr('value');
  if (defaultcolor.length == 0) {
    defaultcolor = null;
  }
  
  $('#moonrockColorPicker').simpleColor({
    cellWidth : 15,
    cellHeight : 15,
    border : '1px solid #333333',
    buttonClass : 'button',
    colors: colors,
    defaultColor: defaultcolor ? MoonrockColorColors[defaultcolor].color : null
  });
	
  var listener = {
    setValue: function(value) {
      var nid = MoonrockColorKeys["#" + value];
      $("#moonrockColorPickerName").html(MoonrockColorColors[nid].title);
      $('[measure_content_type="moonrock_color"]').attr('value', nid);
    },
    resetValue: function() {
      $("#moonrockColorPickerName").html(" ");
      $('[measure_content_type="moonrock_color"]').attr("name", "");
    }
  };
  
  if (defaultcolor) {
    $("#moonrockColorPickerName").html(MoonrockColorColors[defaultcolor].title);
  }

  ColorPickerSelection.setListener(listener);
});
