<?php

function moonrock_seesamples_create_sample_table($node, $search = FALSE) {
  $samples = moonrock_seesamples_retrieve_samples($node);
  return moonrock_sample_display_table_and_search($samples, $search);
}

function moonrock_seesamples_retrieve_samples($node) {
  $result = array();
  $sample_list = explode("\n", $node->samples);
  $query = "SELECT {node}.nid, {moonrock_sample}.vm, {moonrock_sample}.snapshot, {moonrock_sample}.location "
          . "FROM {node} "
          . "LEFT JOIN {moonrock_sample} on {node}.nid={moonrock_sample}.nid "
          . "WHERE {node}.type='moonrock_sample' "
          . "AND {node}.title LIKE '%s' LIMIT 1";

  foreach ($sample_list as $sample) {
    $parts = explode("|", trim($sample), 2);
    if (count($parts) == 2) {
      $object = db_fetch_object(db_query($query, $parts[0]));
      if ($object) {
        $object->title = $parts[1];
        $result[] = $object;
      }
    }
  }

  return $result;
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