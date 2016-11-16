/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 */
$.fn.sidebar = function() {
    var $sidebar = this;
    var $container = $('#sidebar');

    /*** Open sidebar ***/
    this.open = function() {
        if (!this.hasClass('on')) {
            this.addClass('on');
            $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
        } else {
            console.log('sidebar already opened');
        }
    };

    /*** Close the sidebar ***/
    this.close = function() {
        if (this.hasClass('on')) {
            this.removeClass('on');
            $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
        } else {
            console.log('sidebar already closed');
        }
    };
    return $sidebar;
};

var sidebar = {};

$(function() {
  sidebar = $('#sidebar').sidebar();

  $('#sidebar-button').click(function() {
    if(!$('#sidebar').hasClass('on')) {
      sidebar.open();
      $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
    } else {
      sidebar.close();
      $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
    }
  })
});
