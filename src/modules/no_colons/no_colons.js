$(document).ready(function(){
	
	//
	// for cck field displays
	//
	if (Drupal.settings.no_colons.no_colons_use_cck_jquery.cck_jquery !== 0) {
		$('.field-label, .field-label-inline, .field-label-inline-first').each( function() {
			
			if (Drupal.settings.no_colons.no_colons_mode == 'all_colons') {
				// remove all colons
				// remove :&nbsp; from end of all cck field displays
				$(this).text($(this).text().replace(/:\xA0$/, ''));
			}
			else if (Drupal.settings.no_colons.no_colons_mode == 'punctuation_colons') {
				// remove colons, only if label text ends in punctuation
				// remove :&nbsp; from end of all cck field displays
				$(this).text($(this).text().replace(/([-%,!=+"'\.\?]):(\xA0)?$/, '$1'));
			}
		});
	}
	
	//
	// for views labels
	// (works for all views, as long as basic display types are used)
	//
	if (Drupal.settings.no_colons.no_colons_use_views_jquery.views_jquery !== 0) {
		$('.view-content div div label, .view-content .views-view-grid tr td div label, .view-content .item-list li div label').each( function() {
			if (Drupal.settings.no_colons.no_colons_mode == 'all_colons') {
				// remove all colons from all views
				$(this).text($(this).text().replace(/:\s+$/, ''));
			}
			else if (Drupal.settings.no_colons.no_colons_mode == 'punctuation_colons') {
				// remove colons from all views, only if label text ends in punctuation
				$(this).text($(this).text().replace(/([-%,!=+"'\.\?]):\s+$/, '$1'));
			}
		});
	}
});