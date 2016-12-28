/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 */
$.fn.sidebar = function() {
  var $sidebar = this;
  this.currentClass = 'hidden';

  this.update = function() {
    if (!$sidebar.hasClass('on')) {
      $sidebar.addClass('on');
      $sidebar.removeClass('hidden');
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
      $('div.gmnoprint[style*="top: 38px"], .gm-svpc').addClass('gm-sidebar-on');
      this.currentClass = 'on';
    } else {
      $sidebar.removeClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
      $('div.gmnoprint[style*="top: 38px"], .gm-svpc').removeClass('gm-sidebar-on');
      this.currentClass = 'hidden';
    }
  };
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

  $('#sidebar-button').click(triggerSidebar);
});

// event handler for clicks to sidebar button
/* exported triggerSidebar */
function triggerSidebar(){
  $('#sidebar').hasClass('on') ? HZ.track( 'map', 'sidebar', 'hide' ) :
                                 HZ.track( 'map', 'sidebar', 'show' );
  $('#sidebar').hasClass('on') ? sidebar.close() : sidebar.open();
}
