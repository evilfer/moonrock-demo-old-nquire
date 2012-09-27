<?php

/**
 * Callback similar to user_edit_form
 * This is the default callback Drupal usees to show the account settings
 * It includes, username, mail, password, picture, signature, status and roles
 * It does not include Profiles.
 *
 * We moved everything out of the way and left only the password form fields
 */
function pux_settings_password_form($form_state, $account) {
	global $user;
	
	$form = array();

  $form['_category'] = array(
    '#type' => 'value',
    '#value' => $category,
  );
  $form['_account'] = array(
    '#type' => 'value',
    '#value' => $account,
  );

  $form['#attributes']['enctype'] = 'multipart/form-data';
	
  $admin = user_access('administer users');
	
	_user_password_dynamic_validation();
  	
	// Account information:
  $form['account'] = array(
    '#weight' => -10,
  );
	
	if (!$register) {
    $form['account']['pass'] = array(
      '#type' => 'password_confirm', 
      '#description' => t('To change the current user password, enter the new password in both fields.'), 
      '#size' => 25,
    );
  }
  elseif (!variable_get('user_email_verification', TRUE) || $admin) {
    $form['account']['pass'] = array(
      '#type' => 'password_confirm', 
      '#description' => t('Provide a password for the new account in both fields.'), 
      '#required' => TRUE, 
      '#size' => 25,
    );
  }
	
	$form['submit'] = array(
		'#type' => 'submit', 
		'#value' => t('Change password'),
		'#weight' => 100,
	);
	
	$form['#uid'] = $uid;
	
	$form['#validate'][] = 'pux_settings_password_form_validate';
	$form['#submit'][] = 'pux_settings_password_form_submit';
	
	return $form;
}

function pux_settings_password_form_validate($form, &$form_state) {
  user_module_invoke('validate', $form_state['values'], $form_state['values']['_account'], $form_state['values']['_category']);
  // Validate input to ensure that non-privileged users can't alter protected data.
  if ((!user_access('administer users') && array_intersect(array_keys($form_state['values']), array('uid', 'init', 'session'))) || (!user_access('administer permissions') && isset($form_state['values']['roles']))) {
    watchdog('security', 'Detected malicious attempt to alter protected user fields.', array(), WATCHDOG_WARNING);
    // set this to a value type field
    form_set_error('category', t('Detected malicious attempt to alter protected user fields.'));
  }
}

function pux_settings_password_form_submit($form, &$form_state) {
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
