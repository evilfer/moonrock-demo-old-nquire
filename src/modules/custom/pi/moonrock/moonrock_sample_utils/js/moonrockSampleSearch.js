

var MoonrockSampleSearch = {
  mainSamples : [],
  favSamples : [],
  searchSamples: [],
  
  init : function() {
    $("a.sample-link img[sample]").each(function() {
      MoonrockSampleSearch.mainSamples.push($(this).attr("sample"));
    });
    
    $("#moonrock_sample_search_sample").change(function() {
      MoonrockSampleSearch.search();
    });
    
    $("#moonrock_sample_search_location").keypress(function(event) {
      if (event.keyCode == 13) {
        MoonrockSampleSearch.search();
        event.stopPropagation();
        event.preventDefault();
      }
    });
  },
  
  toogleFav: function(sampleid) {
    if ($.inArray(sampleid, this.favSamples) < 0) {
      this.addFav(sampleid);
    } else {
      this.removeFav(sampleid);
    }
  },
  addFav: function(sampleid) {
    if ($.inArray(sampleid, this.favSamples)) {
      var selector = ".moonrocksampleresultheader[sample='" + sampleid + "']";
      this.favSamples.push(sampleid);
      $(selector).addClass("moonrocksampleresultheaderfav");
    }    
  },
  _removeSampleIfNecessary:function(sampleid) {
    if ($.inArray(sampleid, this.searchSamples) < 0 && $.inArray(sampleid, this.favSamples) < 0) {
      $(".moonrocksamplesnapshot[sample='" + sampleid + "']").each(function() {
        var parentid = $(this).parent().find(".moonrocksampleresult").attr("sample");
        $(this).remove();
        MoonrockSampleSearch._removeSampleIfNecessary(parentid);
      });
      $(".moonrocksampleresult[sample='" + sampleid + "']").each(function() {
        if ($(this).parent().find(".moonrocksampleresultheaderfav").length == 0) {
          $(this).parent().remove();
        }
      });
    }
  },
  removeFav: function(sampleid) {
    var pos = $.inArray(sampleid, this.favSamples);
    if (pos >= 0) {
      this.favSamples.splice(pos, 1);
      $(".moonrocksample[sample='" + sampleid + "']").find(".moonrocksampleresultheader").removeClass("moonrocksampleresultheaderfav");
      this._removeSampleIfNecessary(sampleid);
      if (typeof(SampleSelectionHelper) != 'undefined') {
        SampleSelectionHelper.unselectIfSelected(sampleid);
      }
    }
  },  
  cleanResults : function() {
    this.searchSamples = [];
    $(".moonrocksamplesnapshot").each(function() {
      var sampleid = $(this).attr("sample");
      if ($.inArray(sampleid, MoonrockSampleSearch.favSamples) < 0) {
        $(this).remove();
      }
    });
    
    $(".moonrocksampleresult").each(function() {
      var sampleid = $(this).attr("sample");
      if ($.inArray(sampleid, MoonrockSampleSearch.favSamples) < 0 && 
        $(this).parent().find(".moonrocksamplesnapshot").length == 0) {
        $(this).parent().remove();
      }
    });
  },
  processResults: function(data) {
    this.cleanResults();

    
    for(var i in data.samples) {
      var sample = data.samples[i];
      this.searchSamples.push(sample.nid);
      var sampleselector = ".moonrocksampleresult[sample='" + sample.nid + "']";
      var row = null;
      if ($(sampleselector).length == 0) {
        var html = "<div class='moonrocksampleresultrow'>" + data.elements[sample.nid] + "</div>";
        row = $(html).appendTo("#moonrock_sample_search_results");
      } else {
        row = $(sampleselector).parent();
      }
      
      for (var j in sample.snapshots) {
        var snapshot = sample.snapshots[j];
        this.searchSamples.push(snapshot.nid);
        var snapshotselector = ".moonrocksamplesnapshot[sample='" + snapshot.nid + "']";
        if ($(snapshotselector).length == 0) {
        
          $(row).append(data.elements[snapshot.nid]);
        }        
      }
    }

    $(".moonrocksampleresultheader").unbind("click");
    
    $(".moonrocksampleresultheader").click(function() {
      MoonrockSampleSearch.toogleFav($(this).attr("sample"));
    });
    
    if (typeof(SampleSelectionHelper) != "undefined") {
      SampleSelectionHelper.findSamples();
    }
  },
  
  search : function() {
    var samples = $("#moonrock_sample_search_sample").val().join(" ");    
   
    var data = {
      //  location: $("#moonrock_sample_search_location").val(),
      samples: samples
    };

    MoonrockSampleSearch.displayThrobber(true);

    $.ajax({
      url: '?q=moonrock_sample_ajax/search',
      dataType: 'json',
      data: data,
      success: function(data) {
        MoonrockSampleSearch.displayThrobber(false);
        if (data.status) {
          MoonrockSampleSearch.processResults(data.data);
        }
      },
      error: function() {
        MoonrockSampleSearch.displayThrobber(false);
      }
    });
  },
  
  sampleSelected: function(sampleid) {
    this.addFav(sampleid);
  },
  
  retrieveDefaultValue: function(sampleid) {
    if (typeof(SampleSelectionHelper) != "undefined") {
      var data = {
        nid: sampleid.substr(5)
      };
      
      MoonrockSampleSearch.displayThrobber(true);
      
      $.ajax({
        url: '?q=moonrock_sample_display/search',
        dataType: 'json',
        data: data,
        success: function(data) {
          MoonrockSampleSearch.displayThrobber(false);
          if (data.status && data.data.length == 1) {
            MoonrockSampleSearch.processResults(data.data);
            SampleSelectionHelper.setDefaultValue(data.data[0].id);
          }
        },
        error: function() {
          MoonrockSampleSearch.displayThrobber(false);
        }
      });
    }
  },
  displayThrobber: function(shown) {
    if (shown) {
      $("#moonrock_sample_search_throbber > div > div").addClass("throbber");
    } else {
      $("#moonrock_sample_search_throbber > div > div").removeClass("throbber");      
    }
  }
};

