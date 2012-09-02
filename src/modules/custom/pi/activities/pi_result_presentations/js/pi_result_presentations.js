

var PiResultPresentations = {
  count :0,

  init : function() {
    $('#pi-result-presentations-preview-loading, #pi-result-presentations-preview').hide();
    
    
    var color = $('#edit-color').val();
    $("input[name^='bar_color'][value='" + color + "']").attr('checked', 'checked');
    
    var ordinate = $('#edit-ordinate').val();
    var type = this._getChartType();
    if (type === 'histogram') {
      $("select[name='histogram_ordinate']").val(ordinate);
    } else {
      var ordinates = ordinate.split(',');
      for (var i in ordinates) {
        $("input[name^='bar_ordinate'][value='" + ordinates[i] + "']").attr('checked', 'checked');
      }
    }
    
    
    
    $('input[name="chart_type"]').change(function() {
      PiResultPresentations._updateOrdinate(false);
      PiResultPresentations._upateGrahDef();
    });

    $('input[name^="bar_ordinate"]').change(function() {
      PiResultPresentations._upateGrahDef();
    });
    $('input[name^="bar_color"]').change(function() {
      PiResultPresentations._upateGrahDef();
    });
    $('select[name="histogram_ordinate"]').change(function() {
      PiResultPresentations._upateGrahDef();
    });



    $("select[name='abscissa']").change(function() {
      PiResultPresentations._updateAvailableValues(false);
      PiResultPresentations._upateGrahDef();
    });

    this._updateOrdinate(true);
    this._updateAvailableValues(true);
    this._upateGrahDef();
  },

  getBaseURL : function() {
    var currentpath = window.location.search;
    var pos = currentpath.indexOf("activity/");
    var pos2 = currentpath.indexOf("/", pos + "activity/".length);
    if (pos >= 0 && pos2 >= 0) {
      return currentpath.substr(0, pos2) + "/tempchart.png";
    } else {
      return "?q=pi_chart/tempchart.png";
    }
  },

  _updateAvailableValues : function(init) {
    var abscissa = $("select[name='abscissa']").attr('value');
    console.log("abscissa: " + abscissa);

    var barOrdinateCount = 0;
    $("input[name^='bar_ordinate']").each(function() {
      if ($(this).attr('value') === abscissa) {
        $(this).attr('checked', '');
        $(this).parent().parent().addClass('pi-result-presentations-measures-block-hidden');
      } else {
        $(this).parent().parent().removeClass('pi-result-presentations-measures-block-hidden');
        barOrdinateCount++;
      }
    });


    var needNewSelection = $("select[name='histogram_ordinate']").val() == abscissa;

    $("select[name='histogram_ordinate'] option").each(function() {
      if ($(this).attr('value') === abscissa) {
        $(this).removeAttr('selected');
        $(this).addClass('pi-result-presentations-measures-block-hidden');
      } else {
        $(this).removeClass('pi-result-presentations-measures-block-hidden');
        if (needNewSelection) {
          $("select[name='histogram_ordinate']").val($(this).attr('value'));
          needNewSelection = false;
        }
      }
    });

  },
  
  _getChartType:function() {
    return $("input[value='line-bar']")[0].checked ? 'line-bar' : 'histogram';//attr('value');
  },
  _updateOrdinate: function(init) {
    var type = this._getChartType();
    
    console.log("type: " + type);

    if (type === 'line-bar') {
      this._hideHistogramOrdinage();
      if (!init) {
        this._showBarOrdinate();
      }
    } else {
      this._hideBarOrdinate();
      if (!init) {
        this._showHistogramOrdinage();
      }
    }
  },

  _hideHistogramOrdinage: function() {
    $('#pi-result-presentations-select-ordinates-histogram').addClass('pi-result-presentations-measures-block-hidden');
  },
  _showHistogramOrdinage: function() {
    $('#pi-result-presentations-select-ordinates-histogram').removeClass('pi-result-presentations-measures-block-hidden');
  },

  _hideBarOrdinate: function() {
    $('#pi-result-presentations-select-ordinates-bar').addClass('pi-result-presentations-measures-block-hidden');
    $('#pi-result-presentations-select-color').addClass('pi-result-presentations-measures-block-hidden');

    $("input[name^='bar_ordinate']").attr('checked', 'checked');
  },
  _showBarOrdinate: function() {
    $("input[name^='bar_ordinate']").attr('checked', '');
    $('#pi-result-presentations-select-ordinates-bar').removeClass('pi-result-presentations-measures-block-hidden');
    $('#pi-result-presentations-select-color').removeClass('pi-result-presentations-measures-block-hidden');
  },

  _upateGrahDef: function() {
    var title = $('#edit-title').attr('value');

    var type = $("input[value='line-bar']")[0].checked ? 'line-bar' : 'histogram';
    var abscissa = $("select[name='abscissa']").attr('value');
    var ordinate = null;
    var color = null;
    if (type === 'line-bar') {
      ordinate = [];
      $("input[name^='bar_ordinate']").each(function() {
        if ($(this).attr('checked')) {
          ordinate.push($(this).attr('value'));
        }
      });
      color = '';
      $("input[name^='bar_color']").each(function() {
        if ($(this).attr('checked')) {
          color = $(this).attr('value');
        }
      });
    } else {
      ordinate = [$("select[name='histogram_ordinate']").val()];
      color = '';
    }

    if (abscissa.length > 0) {
      $('#edit-abscissa').attr('value', abscissa);
    } else {
      $('#edit-abscissa').removeAttr('value');
    }
    if (ordinate.length > 0) {
      $('#edit-ordinate').attr('value', ordinate.join(','));
    } else {
      $('#edit-ordinate').removeAttr('value');
    }
    $('#edit-color').attr('value', color);

    if (abscissa.length > 0 && ordinate.length > 0) {
        $('#pi-result-presentations-preview').show();
      //$('#pi-result-presentations-preview').hide();
      $('#pi-result-presentations-preview-no').hide();
      $('#pi-result-presentations-preview-loading').show();
      var url = this.getBaseURL() + "&title=" + title +
              "&count=" + (this.count++) + "&type=" + type +
              "&abscissa=" + abscissa + "&ordinate=" + ordinate.join(',') +
              "&color=" + color;
      $('#pi-result-presentations-preview').attr('src', url).load(function() {
        $('#pi-result-presentations-preview-loading').hide();
      });

    } else {
      $('#pi-result-presentations-preview').hide();
      $('#pi-result-presentations-preview-loading').hide();
      $('#pi-result-presentations-preview-no').show();
    }
  }
};

$(function() {
  PiResultPresentations.init();
});
