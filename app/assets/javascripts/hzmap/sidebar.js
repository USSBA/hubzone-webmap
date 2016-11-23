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
      $('#sidebar').css('display', 'block');
      $sidebar.addClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
    } else {
      $sidebar.removeClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
    }
  }
  /*** Open the sidebar ***/
  this.open = function() {
    if (!$sidebar.hasClass('on')) {
      $sidebar.update();
    }
  };
  /*** Close the sidebar ***/
  this.close = function() {
    if ($sidebar.hasClass('on')) {
      $sidebar.update();
    }
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
