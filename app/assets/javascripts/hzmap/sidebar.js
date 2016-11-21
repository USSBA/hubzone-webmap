/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 */
$.fn.sidebar = function() {
  var $sidebar = this;
  var $container = $('#sidebar');

  this.update = function() {
    if (!$sidebar.hasClass('on')) {
      $sidebar.addClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
      $('.gm-bundled-control').css('right', '410px');
    } else {
      $sidebar.removeClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
      $('.gm-bundled-control').css('right', '28px');
    }
  }
  /*** Open the sidebar ***/
  this.open = function() {
    $sidebar.update();
  };
  /*** Close the sidebar ***/
  this.close = function() {
    $sidebar.update();
  };
  return $sidebar;
};

var sidebar = {};

/* Sidebar button listener */
$(function() {
  sidebar = $('#sidebar').sidebar();

  $('#sidebar-button').click(function() {
    $('#sidebar').hasClass('on') ? sidebar.close() : sidebar.open()
  })
});
