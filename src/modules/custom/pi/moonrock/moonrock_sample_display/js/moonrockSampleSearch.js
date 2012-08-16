

var MoonrockSampleSearch = {
  mainSamples : [],
  favSamples : [],
  searchSamples: [],
  
  init : function() {
    $("a.sample-link img[sample]").each(function() {
      MoonrockSampleSearch.mainSamples.push($(this).attr("sample"));
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
  removeFav: function(sampleid) {
    var pos = $.inArray(sampleid, this.favSamples);
    if (pos >= 0) {
      var selector = ".moonrocksampleresultheader[sample='" + sampleid + "']";
      this.favSamples.splice(pos, 1);
      if ($.inArray(sampleid, this.searchSamples) < 0) {
        $(".moonrocksampleresult[sample='" + sampleid + "']").remove();
      } else {
        $(selector).removeClass("moonrocksampleresultheaderfav");
      }
      
      SampleSelectionHelper.unselectIfSelected(sampleid);
    }
  },  
  cleanResults : function() {
    this.searchSamples = [];
    $(".moonrocksampleresult").each(function() {
      var sampleid = $(this).attr("sample");
      if ($.inArray(sampleid, MoonrockSampleSearch.favSamples) < 0) {
        $(this).remove();
      }
    });
  },
  processResults: function(samples) {
    this.cleanResults();
    
    for(var i in samples) {
      var sample = samples[i];
      if ($.inArray(sample.id, this.mainSamples) < 0 && $.inArray(sample.id, this.favSamples) < 0) {
        this.searchSamples.push(sample.id);
        
        var html = '<div class="moonrocksample moonrocksampleresult" sample="' + sample.id + '">' + 
        '<div class="moonrocksampleresultimagecontainer">' + 
        '<div class="moonrocksampleresultheader" sample="' + sample.id + '"></div>' + 
        
        '<a class="moonrocksamplesearchresult sample-link" ' + 
        'id="' + sample.id + '" ' + 
        'href="' + sample.vm + '">' + 
        '<img src="' + sample.snapshot + '" name="moonrock_sample_selection" ' +
        'sample="' + sample.id + '"></a></div>' + 
        '<div><center>';
        
        if (typeof(SampleSelectionHelper) != "undefined") {
          html += '<input name="moonrock_sample_selection" id="moonrock_sample_selection-' + sample.id + '" type="radio" ' + 
          'value="' + sample.id + '"><label class="option" for="moonrock_sample_selection-' + sample.id + '"><b>' + sample.title + '</b></label>';
        } else {
          html += '<b>' + sample.title + '</b>'; 
        }        
        html += '</center></div></div>';
      
        $("#moonrock_sample_search_results").append(html);
      }
    }
    
    $("a.moonrocksamplesearchresult").each(function() {
      var href = $(this).attr("href");
      $(this).colorbox({
        href: href, 
        width: '100%', 
        height: '100%', 
        iframe: true
      });
    });
    
    $(".moonrocksampleresultheader").click(function() {
      MoonrockSampleSearch.toogleFav($(this).attr("sample"));
    });
    
    if (typeof(SampleSelectionHelper) != "undefined") {
      SampleSelectionHelper.findSamples();
    }
  },
  
  search : function() {
    var data = {
      location: $("#moonrock_sample_search_location").attr("value")
    };

    MoonrockSampleSearch.displayThrobber(true);

    $.ajax({
      url: '?q=moonrock_sample_display/search',
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

