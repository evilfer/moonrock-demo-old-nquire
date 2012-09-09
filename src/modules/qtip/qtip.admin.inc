<?php
// $Id: qtip.admin.inc,v 1.2 2010/09/06 01:24:02 bocaj Exp $

/**
 * @file
 * Administrative functions for the qTip module.
 */

/**
 * Callback function for admin/settings/qtip
 */
function qtip_settings_form() {
  // If neither paths contain the qTip library
  if (!file_exists(QTIP_PATH . QTIP_FILE) && !file_exists(drupal_get_path('module', 'qtip') .'/library/' . QTIP_FILE)) {
    $message = 'Download';
    // Provide a little more help if admin has specified custom path, but we cannot find the library file
    if (QTIP_PATH != 'sites/all/libraries/qtip/') {
      $message = 'You may need to change the path where the qTip library is pointed or download ';
    }
    drupal_set_message('qTip plugin not found in ' . QTIP_PATH . '! ' . $message .' the <a href="http://craigsworks.com/projects/qtip/download/">qTip jQuery plugin</a> and read this module\'s README.txt file for proper installation procedures.', 'error');
  }

  $form = array();
  $form['qtip_running_version'] = array(
    '#value' => t('<p>qTip library version: %fileversion</p>',
      array(
        '%fileversion' => QTIP_VERSION,
      )
    ),
  );
  /* FIELDSETS */
  $form['style'] = array(
    '#type' => 'fieldset',
    '#title' => t('Styling options'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['event'] = array(
    '#type' => 'fieldset',
    '#title' => t('Event options'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['advanced'] = array(
    '#type' => 'fieldset',
    '#title' => t('Advanced options'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );

  /* STYLE SECTION */
  $form['style']['qtip_target_position'] = array(
    '#type' => 'select',
    '#title' => t('qTip Position'),
    '#options' => array(
      'topLeft' => 'Top Left Corner',
      'topMiddle' => 'Top Middle',
      'topRight' => 'Top Right Corner',
      'rightMiddle' => 'Right Side',
      'bottomRight' => 'Bottom Right Corner',
      'bottomMiddle' => 'Bottom Middle',
      'bottomLeft' => 'Bottom Left Corner',
      'leftMiddle' => 'Left Side',
    ),
    '#description' => t('Set where the qtips should display relative to the link text.'),
    '#default_value' => variable_get('qtip_target_position', 'topRight'),
  );
  $form['style']['qtip_show_speech_bubble_tip'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show speech bubble tip'),
    '#description' => t('If checked, each tooltip will have a tip coming from the tooltip, making it appear like a speech bubble.'),
    '#default_value' => variable_get('qtip_show_speech_bubble_tip', TRUE),
  );
  $form['style']['qtip_show_speech_bubble_tip_side'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show speech bubble tip on side of corner'),
    '#description' => t('If checked <strong>and</strong> \'qTip Position\' above is set to a corner (not a middle or side position), show the speech bubble tip on the side of the link text instead of above or below.'),
    '#default_value' => variable_get('qtip_show_speech_bubble_tip_side', FALSE),

  );
  $form['style']['qtip_color'] = array(
    '#type' => 'select',
    '#title' => t('Color Scheme'),
    '#options' => array(
      'cream' => 'Cream',
      'dark' => 'Dark',
      'green' => 'Green',
      'light' => 'Light',
      'red' => 'Red',
      'blue' => 'Blue',
    ),
    '#description' => t('The color scheme for all qtips.'),
    '#default_value' => variable_get('qtip_color', 'blue'),
  );
  $form['style']['qtip_border_radius'] = array(
    '#type' => 'select',
    '#title' => t('Border Radius'),
    '#options' => array(
      '0' => '0',
      '1' => '1',
      '2' => '2',
      '3' => '3',
      '4' => '4',
      '5' => '5',
      '6' => '6',
      '7' => '7',
      '8' => '8',
      '9' => '9',
      '10' => '10',
    ),
    '#description' => t('The border radius for all qtips. Set to 0 for square corners.<br /><strong>NOTE:</strong> The bigger the radius, the wider the border will be, regardless of the setting below.'),
    '#default_value' => variable_get('qtip_border_radius', '3'),
  );
  $form['style']['qtip_border_width'] = array(
    '#type' => 'select',
    '#title' => t('Border Width'),
    '#options' => array(
      '1' => '1',
      '2' => '2',
      '3' => '3',
      '4' => '4',
      '5' => '5',
      '6' => '6',
      '7' => '7',
      '8' => '8',
      '9' => '9',
      '10' => '10',
    ),
    '#description' => t('The border width for all qtips.'),
    '#default_value' => variable_get('qtip_border_width', '3'),
  );
  /* EVENT SECTION */
  $form['event']['qtip_show_event_type'] = array(
    '#type' => 'radios',
    '#title' => t('Show Event Type'),
    '#options' => array(
      'mouseover' => 'Hover',
      'click' => 'Click',
    ),
    '#description' => t('The action the user must take to <strong>activate</strong> the qtip.
                        <br /><strong>Hover:</strong> User moves mouse over link text.
                        <br /><strong>Click:</strong> User must click on the link text to activate qtip'),
    '#default_value' => variable_get('qtip_show_event_type', 'mouseover'),
  );
  $form['event']['qtip_hide_event_type'] = array(
    '#type' => 'radios',
    '#title' => t('Hide Event Type'),
    '#options' => array(
      'mouseout' => 'Leave',
      'unfocus' => 'Click',
    ),
    '#description' => t('The action the user must take to <strong>hide</strong> the qtip.
                        <br /><strong>Leave:</strong> User moves the mouse away from the link text.
                        <br /><strong>Click:</strong> User clicks anywhere on the document.'),
    '#default_value' => variable_get('qtip_hide_event_type', 'mouseout'),
  );
  $form['event']['qtip_show_solo'] = array(
    '#type' => 'checkbox',
    '#title' => t('Only allow one qtip to show at a time'),
    '#description' => t('If checked <strong>and</strong> \'Hide Event Type\' above is set to \'Click\', only one tooltip will be visible to the user at a time.'),
    '#default_value' => variable_get('qtip_show_solo', TRUE),
  );
  /* ADVANCED SECTION */
  $form['advanced']['qtip_use_uncompressed_js'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use uncompressed qTip library file'),
    '#description' => t('This option allows the administrator to use the non-compressed version of the qTip library for custom implementations of the library.<br /><strong>This should not be enabled unless it is necessary.</strong>'),
    '#default_value' => variable_get('qtip_use_uncompressed_js', 0),
  );
  $form['advanced']['qtip_path_to_library'] = array(
    '#type' => 'textfield',
    '#title' => t('Path to qTip library'),
    '#description' => t('Set a custom relative path to the qTip library.<strong>DO NOT</strong> include a leading or trailing slash.<br /><strong>Leave the default unless you have a specific reason for changing it.</strong>'),
    '#default_value' => variable_get('qtip_path_to_library', 'sites/all/libraries/qtip'),
  );

  return system_settings_form($form);
}