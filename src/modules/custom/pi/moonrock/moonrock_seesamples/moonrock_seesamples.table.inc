<?php 


function moonrock_seesamples_create_sample_table($node) {
	jquery_ui_add(array('ui.draggable', 'ui.resizable'));

	//		drupal_add_js( drupal_get_path('module', 'moonrock_seesamples') .'/js/appmessaging.js');
	drupal_add_css( drupal_get_path('module', 'moonrock_seesamples') .'/css/moonrock.css');
	$output = '';

	$output = '<table><tr>';

	$sample_list = explode("\n", $node->samples);

	foreach ($sample_list as $sample) {
		$sample = trim($sample);
		if (strlen($sample) > 0) {
			$parts = explode(" ", $sample, 2);
			$output .= "<td class='moonrocksamplecell'>";
			$output .= "<div class='moonrocksample'>";
			$output .= "<div class='moonrocksampleiframecontainer'><iframe src='{$parts[0]}'></iframe></div>";
			$output .= "<div><center><a class='colorbox-load sample-link' id='" . str_replace(' ', '_', $parts[1]) . "' href='{$parts[0]}?width=100%&height=100%&iframe=true'><b>{$parts[1]}</b></a></center></div>";
			$output .= "</div>";
			$output .= "</td>";
		}
	}

	$output .= '</tr></table>';
	return $output;
}
