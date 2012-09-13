

var MoonrockDataFormImage = {
  
  getVMImageDataURL: function(width, callback) {
      
    var image = new Image();

    image.onload = function() {
      var ratio = parseFloat(this.height) / this.width;
      var height = ratio * width;
      
      $('#moonrock-data-form-vm-resizecanvas').append('<canvas/>');
      var canvas = $('#moonrock-data-form-vm-resizecanvas').find('canvas')[0];
      canvas.width = width;
      canvas.height = height;

      canvas.getContext("2d").drawImage(this, 0, 0, width, height);
      var resizedData = canvas.toDataURL();
      $(canvas).remove();
      callback(resizedData);
    }

    var vmcanvas = $(frames[0].document).find('#mic1canvas')[0];
    var data = vmcanvas.toDataURL();
    image.src = data;
  }
};

