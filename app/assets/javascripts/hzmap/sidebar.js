window.onload = function() {
  $('#sidebar-button').click(function() {
    if(!$('#sidebar').hasClass('on')) {
      sidebar.open();
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
    } else {
      sidebar.close();
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
    }
  })
}



