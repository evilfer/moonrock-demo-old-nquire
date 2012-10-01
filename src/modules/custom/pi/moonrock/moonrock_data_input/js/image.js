

var MoonrockDataInputImage = {
  
  getVMData: function(width, callback) {
    var image = new Image();
    image.onload = function() {
      var ratio = parseFloat(this.height) / this.width;
      var height = ratio * width;
      
      var resizeCanvas = $('#moonrock-samples-page-vm-resize-canvas')[0];
      resizeCanvas.width = width;
      resizeCanvas.height = height;

      resizeCanvas.getContext("2d").drawImage(this, 0, 0, width, height);
      var resizedData = resizeCanvas.toDataURL();
      
      callback({
        vm_parameters: 'param',
        image: resizedData
      });
    };
    
    if (frames[0]) {
      var vmcanvas = $(frames[0].document).find('#mic1canvas')[0];
      var data = vmcanvas.toDataURL();
      image.src = data;
    }
  }
};
