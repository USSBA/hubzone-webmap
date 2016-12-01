/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 */
$.fn.sidebar = function() {
  var $sidebar = this;
  var $container = $('#sidebar');
  this.currentClass = 'hidden';

  this.update = function() {
    if (!$sidebar.hasClass('on')) {
      $sidebar.addClass('on');
      $sidebar.removeClass('hidden');
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
      this.currentClass = 'on';
    } else {
      $sidebar.addClass('hidden');
      $sidebar.removeClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
      this.currentClass = 'hidden';
    }
  }
  /*** Open the sidebar ***/
  this.open = function() {
    if ($sidebar.hasClass('hidden')) {
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
