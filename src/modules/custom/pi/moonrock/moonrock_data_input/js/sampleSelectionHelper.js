$(function() {

	var SampleSelectionHelper = {
		autoselect : true,
		containers : {},
		addSample : function(sampleid, value) {
			var link = $("#" + sampleid)[0];
			this.containers[value] = link.parentNode.parentNode.parentNode;
		},
		selectSample : function(value) {
			for ( var key in this.containers) {
				if (key == value) {
					$(this.containers[key]).addClass(
							"moonrocksampleselected");
				} else {
					$(this.containers[key]).removeClass(
							"moonrocksampleselected");
				}
			}
		}
	};

	$(".sample-link").each(function(index, element) {
		var value = element.id.replace(/_/g, ' ');

		SampleSelectionHelper.addSample(element.id, value);

		$('input[value="' + value + '"]').click(function() {
			SampleSelectionHelper.autoselect = false;
		});

		$('input[value="' + value + '"]').change(function(event) {
			SampleSelectionHelper.selectSample(this.value);
		});

	});

	$(".sample-link").click(function() {
		var value = this.id.replace(/_/g, ' ');
		if (SampleSelectionHelper.autoselect) {
			$('input[value="' + value + '"]')[0].checked = true;
			$('input[value="' + value + '"]').change();
		}
	});
});