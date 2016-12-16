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
function triggerSidebar(){
  $('#sidebar').hasClass('on') ? sidebar.close() : sidebar.open();
}

/* exported updateAccordions */
function updateAccordions () {
  $('#sidebar button.usa-accordion-button').on('click', triggerAccordion);
}

// event handler for clicks on an accorion button
function triggerAccordion(el){
  var accordionID = el.currentTarget.getAttribute('aria-controls');
  var content = $('#' + accordionID);
  var accordionIsOpen = el.currentTarget.getAttribute('aria-expanded');

  if( accordionIsOpen === 'false' ) {
    $( 'button[aria-controls=' + accordionID + ']' ).attr('aria-expanded', 'true' );
    content.attr('aria-hidden', 'false');
  } else if ( accordionIsOpen === 'true' ) {
    $( 'button[aria-controls=' + accordionID + ']' ).attr('aria-expanded', 'false' );
    content.attr('aria-hidden', 'true');
  }
}
