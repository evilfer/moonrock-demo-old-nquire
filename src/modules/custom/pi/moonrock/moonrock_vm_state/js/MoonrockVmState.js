

var MoonrockVmState = {
  
  init: function() {
    
  },
  
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
        position: snapshot.position,
        image: snapshot.image,
        viewurl: snapshot.viewurl
      }
    });
  }  
};

$(function() {
  MoonrockModules.register('MoonrockVmState', MoonrockVmState);
});
