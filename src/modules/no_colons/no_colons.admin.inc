<?php

function no_colons_settings() {
	
	$form['no_colons_mode'] = array(
		'#type' => 'select',
		'#title' => t('Mode'),
		'#options' => array('all_colons' => 'Remove all colons', 'punctuation_colons' => 'Only remove colons if label text ends in punctuation'),
		'#default_value' => variable_get('no_colons_mode', 'all_colons'),
		'#description' => 'When using "Only remove colons if..." mode, the following punctuation marks will cause colons to be removed: - % . , ! ? " \' = +',
	);
	
	$form['no_colons_use_cck_jquery'] = array(
		'#type' => 'checkboxes',
		'#title' => t(''),
		'#options' => array('cck_jquery' => t('Use jQuery to remove colons from CCK field display labels.')),
		'#description' => t('Alternatively, you can place a copy of modules/cck/theme/content-field.tpl.php into your theme and remove the colons from that template. If you do enable the jQuery option above, the trailing &amp;nbsp; character will also be removed from the label text.'),
		'#default_value' => variable_get('no_colons_use_cck_jquery', array('cck_jquery' => 0)),
	);
	
	$form['no_colons_use_views_jquery'] = array(
		'#type' => 'checkboxes',
		'#title' => t(''),
		'#options' => array('views_jquery' => t('Use jQuery to remove colons from Views field display labels.')),
		'#description' => t('Alternatively, you can disable the field label(s) in the view and rewrite the field as follows: LABEL-TEXT [FIELD-TOKEN]. Another approach is to use a tpl.php specific to the view fields. If you do enable the jQuery option above, the trailing space characters will also be removed from the label text.'),
		'#default_value' => variable_get('no_colons_use_views_jquery', array('views_jquery' => 0)),
	);
			
	return system_settings_form($form);
}