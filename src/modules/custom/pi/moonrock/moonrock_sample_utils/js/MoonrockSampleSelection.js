


var MoonrockSampleSelection = {
  sample: null,
  snapshot: null,
  
  init: function() {
    this.sample = $('input[measure_content_type="moonrock_sample"]').attr('value');
    this.snapshot = $('input[measure_content_type="moonrock_snapshot"]').attr('value');
    this.logStatus();
  },

  select: function(item) {
    if (item.params.type === 'sample') {
      if (this.sample !== item.id) {
        this.snapshot = null;
        this.sample = item.id;
      }
    } else {
      this.snapshot = item.id;
      this.sample = item.params.sampleref;
    }
    this.saveStatus();
  },


  unselectSample: function() {
    this.snapshot = this.sample = null;
    this.saveStatus();
  },

  unselectSnapshot: function() {
    this.snapshot = null;
    this.saveStatus();
  },

  saveStatus: function() {
    $('input[measure_content_type="moonrock_sample"]').attr('value', this.sample);
    $('input[measure_content_type="moonrock_snapshot"]').attr('value', this.snapshot);
    this.logStatus();
  },
  
  logStatus: function() {
    console.log("[" + (this.sample ? this.sample : '    ') + '-' + (this.snapshot ? this.snapshot : '    ') + ']');
  }
};