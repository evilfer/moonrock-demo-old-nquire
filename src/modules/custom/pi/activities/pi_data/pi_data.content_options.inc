<?php

function pi_data_content_options_as_link_title($option_value) {
  return _pi_data_content_options_as_text($option_value, "nquire_display_as_link");
}

function pi_data_content_options_as_key_measure($option_value) {
  return _pi_data_content_options_as_text($option_value, "nquire_display_as_key_measure");
}

function pi_data_content_options_as_measure($option_value) {
  return _pi_data_content_options_as_text($option_value, "nquire_display_as_measure");
}

function _pi_data_content_options_as_text($option_value, $function_sufix) {
  if (strlen($option_value) > 5 && !substr_compare("node_", $option_value, 0, 5)) {
    $nid = substr($option_value, 5);
    $node = node_load($nid);
    if ($node) {
      $function = "{$node->type}_$function_sufix";
      if (function_exists($function)) {
        return $function($node);
      }
    }
  }

  return check_plain($option_value);
}