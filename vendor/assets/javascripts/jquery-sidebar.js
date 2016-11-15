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
    $sidebar.open = function() {
        if (!$sidebar.hasClass('on')) {
            $sidebar.addClass('on');
            $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
        } else {
            console.log('sidebar already opened');
        }
    };

    /*** Close the sidebar ***/
    $sidebar.close = function() {
        if ($sidebar.hasClass('on')) {
            $sidebar.removeClass('on');
            $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
        } else {
            console.log('sidebar already closed');
        }
    };
    return $sidebar;
};
