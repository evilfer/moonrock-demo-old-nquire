<?php

/**
 * Callback similar to user_edit_form
 * This is the default callback Drupal usees to show the account settings
 * It includes, username, mail, password, picture, signature, status and roles
 * It does not include Profiles.
 */
function pux_settings_account_form($form_state, $account) {
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

  // Account information:
  $form['account'] = array(
    '#weight' => -10,
  );
  // Only show name field when: registration page; or user is editing own account and can change username; or an admin user.
  if ($register || ($GLOBALS['user']->uid == $uid && user_access('change own username')) || $admin) {
    $form['account']['name'] = array(
      '#type' => 'textfield', 
      '#title' => t('Username'), 
      '#default_value' => $account->name, 
      '#maxlength' => USERNAME_MAX_LENGTH, 
      '#description' => t('Spaces are allowed; punctuation is not allowed except for periods, hyphens, and underscores.'), 
      '#required' => TRUE,
    );
  }
  $form['account']['mail'] = array(
    '#type' => 'textfield', 
    '#title' => t('E-mail address'), 
    '#default_value' => $account->mail, 
    '#maxlength' => EMAIL_MAX_LENGTH, 
    '#description' => t('A valid e-mail address. All e-mails from the system will be sent to this address. The e-mail address is not made public and will only be used if you wish to receive a new password or wish to receive certain news or notifications by e-mail.'), 
    '#required' => TRUE,
  );
  
  if ($admin) {
    $form['account']['status'] = array(
      '#type' => 'radios', 
      '#title' => t('Status'), 
      '#default_value' => isset($account->status) ? $account->status : 1, 
      '#options' => array(t('Blocked'), t('Active')),
    );
  }
  if (user_access('administer permissions')) {
    $roles = user_roles(TRUE);

    // The disabled checkbox subelement for the 'authenticated user' role
    // must be generated separately and added to the checkboxes element,
    // because of a limitation in D6 FormAPI not supporting a single disabled
    // checkbox within a set of checkboxes.
    // TODO: This should be solved more elegantly. See issue #119038.
    $checkbox_authenticated = array(
      '#type' => 'checkbox', 
      '#title' => $roles[DRUPAL_AUTHENTICATED_RID], 
      '#default_value' => TRUE, 
      '#disabled' => TRUE,
    );

    unset($roles[DRUPAL_AUTHENTICATED_RID]);
    if ($roles) {
      $default = empty($account->roles) ? array() : array_keys($account->roles);
      $form['account']['roles'] = array(
        '#type' => 'checkboxes', 
        '#title' => t('Roles'), 
        '#default_value' => $default, 
        '#options' => $roles, 
        DRUPAL_AUTHENTICATED_RID => $checkbox_authenticated,
      );
    }
  }

  // Signature:
  if (variable_get('user_signatures', 0) && module_exists('comment') && !$register) {
    $form['signature_settings'] = array(
      '#type' => 'fieldset', 
      '#title' => t('Signature settings'), 
      '#weight' => 1,
    );
    $form['signature_settings']['signature'] = array(
      '#type' => 'textarea', 
      '#title' => t('Signature'), 
      '#default_value' => $account->signature, 
      '#description' => t('Your signature will be publicly displayed at the end of your comments.'),
    );

    // Prevent a "validation error" message when the user attempts to save with a default value they
    // do not have access to.
    if (!filter_access($account->signature_format) && empty($_POST)) {
      drupal_set_message(t("The signature input format has been set to a format you don't have access to. It will be changed to a format you have access to when you save this page."));
      $account->signature_format = FILTER_FORMAT_DEFAULT;
    }

    $form['signature_settings']['signature_format'] = filter_form($account->signature_format, NULL, array('signature_format'));
  }

	$form['#uid'] = $uid;
	
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t("Save changes"),
		'#weight' => 30,
	);
	
	if (user_access('administer users')) {
    $form['delete'] = array(
      '#type' => 'submit', 
      '#value' => t('Delete'), 
      '#weight' => 31, 
      '#submit' => array('user_edit_delete_submit'),
    );
  }
	
	$form['#validate'][] = 'pux_settings_account_form_validate';
	$form['#submit'][] = 'pux_settings_account_form_submit';
	
	return $form;
}

/**
 * Validate function
 * Again, this is the same callback Drupal uses to validate
 */
function pux_settings_account_form_validate($form, &$form_state) {
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
 */
function pux_settings_account_form_submit($form, &$form_state) {
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


