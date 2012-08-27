
var MoonrockReviewFindings = {
  lastString : "",

  search : function() {
    $('#moonrock-review-findings-search-throbber').addClass('active');
    var data = $('form#moonrock-review-findings-search-form').serialize();
    $.ajax({
      type: "POST",
      url: "?q=moonrock_review_findings/search",
      data: data,
      dataType: 'json',
      success: function(data) {
        $('#moonrock-review-findings-search-throbber').removeClass('active');
        if (data.status) {
          $('#moonrock_review_findings_results').html(data.data);
          MoonrockShareFindingsView.init();
        } else {
          $('#moonrock_review_findings_results').html("Error while loading search results...");
        }
      },
      error: function() {
        $('#moonrock-review-findings-search-throbber').removeClass('active');
      }
    });
  },

  newText : function(text) {
    if (text !== this.lastString) {
      this.lastString = text;
      this.search();
    }
  }
};

$(function() {
  $("form#moonrock-review-findings-search-form").find("input[type='checkbox'], select").change(function() {
    MoonrockReviewFindings.search();
  });
  /*$("#edit-words").keypress(function(event) {
    if (event.keyCode === 13) {
      MoonrockReviewFindings.newText(this.value);
      event.stopPropagation();
      event.preventDefault();
    }
  });*/
  $("#edit-words").change(function(event) {
    MoonrockReviewFindings.newText(this.value);
  });

  MoonrockReviewFindings.search();
});


