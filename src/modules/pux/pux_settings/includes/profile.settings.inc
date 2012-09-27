<?php

/**
 * Duplicate of user_edit()
 *
 * We use this to call our own callback inside drupal_get_form()
 * and to change the title to "Settings"
 *
 * This function will only load the right form and pass the $account and $category
 *
 * @see pux_settings_profile_settings_form()
 * @see pux_settings_settings_validate()
 * @see pux_settings_settings_submit()
 */
function pux_settings_user_edit($account, $category) {
  drupal_set_title(t("Settings"));
  return drupal_get_form('pux_settings_profile_form', $account, $category);
}

/**
 * This form is called when using Profiles
 * to generate the right page inside a Tab
 *
 * This is a copy of user_edit_form
 */
function pux_settings_profile_form($form_state, $account, $category) {
	global $user;
	
	$form = array();
	$edit = (empty($form_state['values'])) ? (array) $account : $form_state['values'];

	// Call every implementation in hook_user($op = "register")
  $form = _user_forms($edit, $account, $category);
  $form['_category'] = array(
    '#type' => 'value',
    '#value' => $category,
  );
  $form['_account'] = array(
    '#type' => 'value',
    '#value' => $account,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save changes'),
    '#weight' => 30,
  );

  $form['#attributes']['enctype'] = 'multipart/form-data';
	
	$form['#validate'][] = 'pux_settings_profile_form_validate';
	$form['#submit'][] = 'pux_settings_profile_form_submit';

	return $form;
}

/**
 * Validate callback
 * This is the ame callback as user_edit_validate
 */
function pux_settings_profile_form_validate($form, &$form_state) {
  user_module_invoke('validate', $form_state['values'], $form_state['values']['_account'], $form_state['values']['_category']);
  // Validate input to ensure that non-privileged users can't alter protected data.
  if ((!user_access('administer users') && array_intersect(array_keys($form_state['values']), array('uid', 'init', 'session'))) || (!user_access('administer permissions') && isset($form_state['values']['roles']))) {
    watchdog('security', 'Detected malicious attempt to alter protected user fields.', array(), WATCHDOG_WARNING);
    // set this to a value type field
    form_set_error('category', t('Detected malicious attempt to alter protected user fields.'));
  }
}

/**
 * Submit callback
 * This is the same callback as user_edit_submit
 */
function pux_settings_profile_form_submit($form, &$form_state) {
  $account = $form_state['values']['_account'];
  $category = $form_state['values']['_category'];
  unset($form_state['values']['_account'], $form_state['values']['op'], $form_state['values']['submit'], $form_state['values']['delete'], $form_state['values']['form_token'], $form_state['values']['form_id'], $form_state['values']['_category']);
  user_module_invoke('submit', $form_state['values'], $account, $category);
  user_save($account, $form_state['values'], $category);

  // Clear the page cache because pages can contain usernames and/or profile information:
  cache_clear_all();

  drupal_set_message(t('The changes have been saved.'));
  return;
}
