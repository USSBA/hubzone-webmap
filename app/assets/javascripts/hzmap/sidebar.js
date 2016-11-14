window.onload = function() {
  $('.sidebar-tabs a').click(function() {
  if( $('#sidebar').hasClass('collapsed') === true ) {
    $('a#home-tab').html('<i class="fa fa-chevron-left"></i>');
  } else {
    $('a#home-tab').html('<i class="fa fa-chevron-right"></i>');
  }
});
}



