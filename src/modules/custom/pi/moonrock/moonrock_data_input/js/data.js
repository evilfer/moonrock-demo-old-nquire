

var MoonrockDataInput = {
  dataModified: false,
  
  init: function() {
    var self = this;
    MoonrockVmViewManager.addSampleSelectionCallback(function(sample) {
      self.setSample(sample);
    });      
  },
  
  
  
  setSample: function(sample) {
    this.clearForm();
    this.updateSampleData(sample);
  },
  
  setItem: function(item) {
    
  },
  
  clearForm: function() {
    this.dataModified = false;
    
    if ($.fn.rockColorPicker) {
      $('body').rockColorPicker('clearSelection');
    }
    
    $('input[type="text"], textarea').val('');
    $('select').val(null);
  },
  
  updateSampleData: function(sample) {
    $('input[measure_content_type="moonrock_sample"]').attr('value', sample.id);
    $('#moonrock-measure-fixedvalue-sample').html(sample.title);
  },
  
  submitData: function() {
    MoonrockDataInputImage.getVMData(200, function(snapshot) {
      $('input[measure_content_type="moonrock_snapshot_image"]').attr('value', snapshot.image);
      $('input[measure_content_type="moonrock_snapshot_parameters"]').attr('value', snapshot.vm_parameters);
      $('input[measure_content_type="moonrock_snapshot_notes"]').attr('value', $('form#node-form').find('.form-textarea').val());
    });
  },
    
  
  saveData: function() {
    
  },
  updateData: function() {
    
  },
  saveNewData: function() {
    
  },
  deleteData: function() {
    
  }  
};

$(function() {
  MoonrockDataInput.init();
});

