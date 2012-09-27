<?php

/**
 * This module provides two hooks so any module can integrate with this module
 * Both hooks are very simple to implement
 */

/**
 * hook_account_settings()
 *
 * Defines $items that will be converted to menu links under settings/uid/foo
 *
 * The array is built using the same keys as in hook_menu with the exception of
 * menu 'type'. All items menus generated with this hook will be of type MENU_LOCAL_TASK
 *
 * There are two ways to create a settings page using this module:
 *
 * 1. If the module uses drupal_get_form as 'page callback' it is not neccesary to
 * declare it, but is necesary to declare the 'page arguments' to call your
 * own function.
 *
 * 2. If the module uses a different 'page callback', you need to define a bridge
 * function to take the right arguments (see the openid example below). In this case
 * profile_page_openid_settings_form is being called as the 'page callback' but
 * uses different 'page arguments'.
 *
 * In the bride function, you'll have to do something like:
 *
 *	function profile_page_openid_settings_form($account) {
 *	  // call the file where the function lives
			include_once(drupal_get_path("module", "openid") . "/openid.pages.inc");
			// return the page callback you'll usually define in the menu link
			return openid_user_identities($account);
		}
 *
 * @return $items
 * an array of $items to be converted as menu links
 * 
 */
function hook_account_settings() {
  $items = array();
	
	$items[] = array(
    'name' => 'profile', 
    'title' => t('Profile'), 
    'weight' => 2,
		'page arguments' => array('profile_page_profile_settings_form', 1, 2),
		'file path' => drupal_get_path("module", "profile_page") . '/includes',
		'file' => 'profile_page_profile.settings.inc'
  );
	$items[] = array(
    'name' => 'password', 
		'title' => t('Password'), 
		'weight' => 1,
		'page arguments' => array('profile_page_password_settings_form', 1, 2),
		'file path' => drupal_get_path("module", "profile_page") . '/includes',
		'file' => 'profile_page_password.settings.inc'
  );
	if(module_exists("shortcut")) {
		$items[] = array(
			'name' => 'shortcuts', 
			'title' => t('Shortcuts'), 
			'weight' => 3,
			'page arguments' => array('shortcut_set_switch'),
			'file path' => drupal_get_path("module", "shortcut"),
			'file' => 'shortcut.admin.inc'
		);
	}
	if(module_exists("openid")) {
		$items[] = array(
			'name' => 'openid', 
			'title' => t('OpenID Identities'), 
			'weight' => 10,
			'page callback' => 'profile_page_openid_settings_form',
			'page arguments' => array(1),
			'file path' => drupal_get_path("module", "profile_page") . '/includes',
			'file' => 'profile_page_openid.settings.inc'
		);
	}
	
	return $items;
}

/**
 * hook_settings_disable()
 *
 * This hook is neccesary to avoid having settings tabs in user/uid/foo
 * and it will load a hook_menu_alter() to disable access to the tabs
 * created by your module
 *
 * @return array an array of link paths to disable if this module is active
 */
function hook_settings_disable() {
	return array(
		'user/%user/openid',
		'user/%user/shortcuts',
	);
}