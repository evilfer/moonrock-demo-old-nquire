<?php

/**
 * Callback to show any fields attached to the user
 */
function pux_settings_openid_form($account) {	
	include_once(drupal_get_path("module", "openid") . "/openid.pages.inc");
	return openid_user_identities($account);
}

