

var MoonrockVmState = {
  
  get: function(callback) {
    $.ajax({
      url: '?q=moonrock_vm_state/get',
      dataType: 'json',
      data: {
        time: new Date().getTime()
      },
      success: function(data) {
        if (data.status) {
          callback(data.data);
        } else {
          callback(false);
        }
      },
      error: function() {
        callback(false);
      }
    });
  },
  set: function(sampleId, snapshot) {
    $.ajax({
      url: '?q=moonrock_vm_state/set',
      type: 'POST',
      dataType: 'json',
      data: {
        sample_nid: sampleId,
        vm_parameters: snapshot.vm_parameters,
        image: snapshot.image
      }
    });
  }  
};
