
var MoonrockDataFormData = {
  selectedSampleId: null,
  init: function() {
    this.selectedSampleId = $('[measure_content_type="moonrock_sample"]').val();
  },
  
  sampleData: function() {
    return this.selectedSampleId;
  },
  
  vmOpened: function(item) {
    $('[measure_content_type="moonrock_sample"]').attr('value', item.sample.nid);
    $('#moonrock-measure-fixedvalue-sample').html(item.title);
  },
  
  submitData: function() {
    MoonrockDataFormImage.getVMData(200, function(snapshot) {
      $('input[measure_content_type="moonrock_snapshot_image"]').attr('value', snapshot.image);
      $('input[measure_content_type="moonrock_snapshot_parameters"]').attr('value', snapshot.vm_parameters);
      $('input[measure_content_type="moonrock_snapshot_notes"]').attr('value', $('form#node-form').find('.form-textarea').val());
      $('form#node-form').submit();
    });
  }
};
