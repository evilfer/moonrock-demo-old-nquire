
var MoonrockDataFormData = {
  selectedSampleId: null,
  selectedSnapshotId: null,
  selectedItemId: null,
  init: function() {
    this.selectedSampleId = $('[measure_content_type="moonrock_sample"]').val();
    this.selectedSnapshotId = $('[measure_content_type="moonrock_snapshot"]').val();
    this.selectedItemId = this.selectedSnapshotId ? this.selectedSnapshotId : this.selectedSampleId;
  },
  
  itemAdded: function(item) {
    if (item.id == this.selectedItemId) {
      MoonrockDataFormSamples.openVM(item);
    }
  },
  
  vmOpened: function(item) {
    $('[measure_content_type="moonrock_sample"]').attr('value', item.sample);
    if (item.snapshot && item.own_snapshot) {
      $('[measure_content_type="moonrock_snapshot"]').attr('value', item.snapshot);
      $('#moonrock-measure-fixedvalue-snapshot').html(item.snapshot_title).removeClass('moonrock-snapshot-no-value');
    } else {
      $('[measure_content_type="moonrock_snapshot"]').removeAttr('value');
      var text = item.snapshot ? '&lt;Not my snapshot&gt;' : '&lt;no snapshot&gt;'; 
      $('#moonrock-measure-fixedvalue-snapshot').html(text).addClass('moonrock-snapshot-no-value');
    }
    $('#moonrock-measure-fixedvalue-sample').html(item.sample_title);
  }
  
};
