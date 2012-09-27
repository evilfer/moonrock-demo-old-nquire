<?php

function pux_settings_picture_form($form_state, $account) {
	global $user;
	
	$form = array();

  $form['_category'] = array(
    '#type' => 'value',
    '#value' => "account",
  );
  $form['_account'] = array(
    '#type' => 'value',
    '#value' => $account,
  );

  $form['#attributes']['enctype'] = 'multipart/form-data';
	
  $admin = user_access('administer users');
	
	// Picture/avatar:
  if (variable_get('user_pictures', 0) && !$register) {
    $form['picture'] = array(
      '#type' => 'markup',
      '#weight' => 1,
    );
    drupal_add_css(drupal_get_path("module", "pux_settings") . '/pux_settings.css');
    $picture = theme('user_picture', (object) $account);
    if ($account->picture) {
      $form['current_picture'] = array(
				'#value' => $picture,
				'#prefix' => '<div class="settings-picture">',
				'#suffix' => '</div>'
			);
      $form['picture']['picture_delete'] = array(
        '#type' => 'checkbox',
        '#title' => t('Delete picture'),
        '#description' => t('Check this box to delete your current picture.'),
      );
    }
    else {
      $form['picture']['picture_delete'] = array('#type' => 'hidden');
    }
    $form['picture']['picture_upload'] = array(
      '#type' => 'file',
      '#title' => t('Upload picture'),
      '#size' => 48,
      '#description' => t('Your virtual face or picture. Maximum dimensions are %dimensions and the maximum size is %size kB.', array('%dimensions' => variable_get('user_picture_dimensions', '85x85'), '%size' => variable_get('user_picture_file_size', '30'))) . ' ' . variable_get('user_picture_guidelines', ''),
    );
    $form['#validate'][] = 'user_profile_form_validate';
    $form['#validate'][] = 'user_validate_picture';
  }
	
  $form['#uid'] = $account->uid;
	
	$form['submit'] = array(
		'#type' => 'submit', 
		'#value' => t('Save changes'),
		'#weight' => 100,
	);
	
	$form['#submit'][] = 'pux_settings_picture_form_submit';
	
	return $form;
}

function pux_settings_picture_form_submit($form, &$form_state) {
	$account = $form_state['values']['_account'];
  $category = $form_state['values']['_category'];
	
	// Delete picture if requested, and if no replacement picture was given.
  if (!empty($edit['picture_delete'])) {
    if ($account->picture && file_exists($account->picture)) {
      file_delete($account->picture);
    }
    $edit['picture'] = '';
  }
  if (isset($edit['roles'])) {
    $edit['roles'] = array_filter($edit['roles']);
  }
	
  unset($form_state['values']['_account'], $form_state['values']['op'], $form_state['values']['submit'], $form_state['values']['delete'], $form_state['values']['form_token'], $form_state['values']['form_id'], $form_state['values']['_category']);
  user_module_invoke('submit', $form_state['values'], $account, $category);
  user_save($account, $form_state['values'], $category);
	
	// If imagecache is installed chanches are is being used with user picturs
	// so flush the image cache to regenerate the image
	if(module_exists("imagecache")) {
		imagecache_image_flush($account->picture);
	}

  // Clear the page cache because pages can contain usernames and/or profile information:
  cache_clear_all();

  drupal_set_message(t('The changes have been saved.'));
  return;
}

