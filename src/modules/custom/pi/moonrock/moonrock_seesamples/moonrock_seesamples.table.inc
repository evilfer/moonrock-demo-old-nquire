<?php


function moonrock_seesamples_get_alternative_sample_title($node, $title) {
  $sample_list = explode("\n", $node->samples);

  foreach ($sample_list as $sample) {
    $parts = explode("|", trim($sample), 2);
    if (count($parts) == 2) {
      if (!strcmp($parts[0], $title)) {
        return $parts[1];
      }
    }
  }
  
  return $title;
}

function moonrock_seesamples_get_main_samples($node) {
  $result = array();
  $sample_list = explode("\n", $node->samples);


  $query = "SELECT {node}.nid FROM {node} "
          . "LEFT JOIN {moonrock_sample} on {node}.nid={moonrock_sample}.nid "
          . "WHERE {node}.type='moonrock_sample' "
          . "AND {node}.title LIKE '%s' LIMIT 1";

  foreach ($sample_list as $sample) {
    $parts = explode("|", trim($sample), 2);
    if (count($parts) == 2) {
      $object = db_fetch_object(db_query($query, $parts[0]));
      if ($object) {
        $result[] = node_load($object->nid);
      }
    }
  }

  return $result;
}

function moonrock_seesamples_search_enabled($node) {
  $sample_view_activity_id = get_activity_id_for_nid($node->nid);
  $sample_view_activity = pi_activity_load($sample_view_activity_id);

  return $sample_view_activity && strpos($sample_view_activity->parameters, "moonrock_sample_search") !== FALSE;
}

function moonrock_seesamples_specific_sample_title($node, $sample_node) {
  $sample_list = explode("\n", $node->samples);

  $titles = array();
  foreach ($sample_list as $sample) {
    $parts = explode("|", trim($sample), 2);

    if (count($parts) == 2 && !strcasecmp($parts[0], $sample_node->title)) {
      return $parts[1];
    }
  }
  return NULL;
}