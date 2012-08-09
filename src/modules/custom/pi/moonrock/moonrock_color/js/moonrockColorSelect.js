
$(function() {
	$('#moonrockColorPicker').simpleColor({
		cellWidth : 15,
		cellHeight : 15,
		border : '1px solid #333333',
		buttonClass : 'button',
		colors: colorPickerColors
	});
	
	ColorPickerSelection.setListener({
		setValue: function(value) {
			var color = colorPickerColorKeys["c" + value];
			$("#" + colorPickerFormId + "-textvalue").html(color.name);
			$("#" + colorPickerFormId + "-hidden").attr("name", $("#" + colorPickerFormId + "-hidden").attr("activename"));
			$("#" + colorPickerFormId + "-hidden").attr("value", color.nid);
		},
		resetValue: function() {
			$("#" + colorPickerFormId + "-textvalue").html("");
			$("#" + colorPickerFormId + "-hidden").attr("name", "ignore");
		}
	});
});
