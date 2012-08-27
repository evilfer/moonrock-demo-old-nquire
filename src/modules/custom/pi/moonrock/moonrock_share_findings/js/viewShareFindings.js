


var MoonrockShareFindingsView = {
  init: function() {
    $(".moonrock-share-findings-collapsible").collapsible();
    $(".moonrock-share-findings-hidden").removeClass("moonrock-share-findings-hidden");
  }
};

$(function() {
  MoonrockShareFindingsView.init();
});
