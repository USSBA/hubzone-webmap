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
      this.currentClass = 'on';
    } else {
      $sidebar.removeClass('on');
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
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

  $('#sidebar-button').click(function() {
    $('#sidebar').hasClass('on') ? sidebar.close() : sidebar.open();
  });
});

function updateAccordions () {
  $('button.usa-accordion-button').on('click', function(){
    var accordionID = this.getAttribute('aria-controls');
    var content = $('#' + accordionID);
    var accordionIsOpen = $( this ).attr('aria-expanded');

    if( accordionIsOpen === 'false' ) {
      $( 'button[aria-controls=' + accordionID + ']' ).attr('aria-expanded', 'true' );
      content.attr('aria-hidden', 'false');
    } else if ( accordionIsOpen === 'true' ) {
      $( 'button[aria-controls=' + accordionID + ']' ).attr('aria-expanded', 'false' );
      content.attr('aria-hidden', 'true');
    }
  });
}
