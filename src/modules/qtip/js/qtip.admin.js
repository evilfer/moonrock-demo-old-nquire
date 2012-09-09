$(document).ready(function() {
  /**
    Load the page initially with the correct settings
  */
  if ($('input[name=qtip_show_speech_bubble_tip]').is(':checked') && $('select[name=qtip_target_position]').val().indexOf('Middle') <= 0) {
    $('#edit-qtip-show-speech-bubble-tip-side-wrapper').show('fast');
  }
  else {
    $('#edit-qtip-show-speech-bubble-tip-side-wrapper').hide('fast');
  }
  // If the selected option is Click ... qTip library needs the value of 'unfocus' so that is the key of the option
  if ($('input[name=qtip_hide_event_type]:checked').val() == 'unfocus') {
    $('#edit-qtip-show-solo-wrapper').show('fast');
  }
  else {
    $('#edit-qtip-show-solo-wrapper').hide('fast');      
  }


  /**
    Events on admin settings page...
  */
  $('select[name=qtip_target_position]').change(function(){
    // If the selected option has the word 'Middle' in it...thus we cannot change the tip position
    // and 'Show speech bubble tip' is checked'
    if ($('select[name=qtip_target_position]').val().indexOf('Middle') <= 0 && $('input[name=qtip_show_speech_bubble_tip]').is(':checked')) {
      $('#edit-qtip-show-speech-bubble-tip-side-wrapper').show('fast');
    }
    else {
      $('#edit-qtip-show-speech-bubble-tip-side-wrapper').hide('fast');
    }
  });
  
  $('input[name=qtip_show_speech_bubble_tip]').change(function(){
    // If 'Show speech bubble tip' is checked and tooltip position is in a corner
    if ($('input[name=qtip_show_speech_bubble_tip]').is(':checked') && $('select[name=qtip_target_position]').val().indexOf('Middle') <= 0) {
      $('#edit-qtip-show-speech-bubble-tip-side-wrapper').show('fast');
    }
    else {
      $('#edit-qtip-show-speech-bubble-tip-side-wrapper').hide('fast');
    }
  });
  
  $('input[name=qtip_hide_event_type]').change(function(){
    // If the selected option is Click ... qTip library needs the value of 'unfocus' so that is the key of the option
    if ($('input[name=qtip_hide_event_type]:checked').val() == 'unfocus') {
      $('#edit-qtip-show-solo-wrapper').show('fast');
    }
    else {
      $('#edit-qtip-show-solo-wrapper').hide('fast');      
    }
  });
});