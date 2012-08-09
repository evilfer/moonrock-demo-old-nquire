
var MoonrockReviewNotes = {
  lastString : "",
  
  search : function() {
    if ($("div.throbber").length == 0) {
      $("#edit-submit").trigger("click");
    }
  },

  newText : function(text) {
    if (text != this.lastString) {
      this.lastString = text;
      this.search();
    }
  }
};

$(function() {
  $("#edit-users").click(function() {
    MoonrockReviewNotes.search();
  });
  $("#edit-words").keypress(function(event) {
    if (event.keyCode == 13) {
      MoonrockReviewNotes.newText(this.value);
      event.stopPropagation();
      event.preventDefault();
    }
  });
  $("#edit-words").change(function(event) {
    MoonrockReviewNotes.newText(this.value);
  });
  
  MoonrockReviewNotes.search();
});


