//Sidebar utils
HZApp.SidebarUtils = (function(){
  // extend jquery with our sidebar function
  $.fn.sidebar = function() {
    var $sidebar = this;

    $sidebar.update = function() {
      if (!$sidebar.hasClass('on')) {
        $sidebar.addClass('on');
        $('#legend').addClass('legend-mobile');
        $sidebar.removeClass('hidden');
        $sidebar.removeClass('closed');
        $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
        $('div.gmnoprint[controlheight="55"], div.gmnoprint[controlheight="66"], .gm-svpc').addClass('gm-sidebar-on');
        $('#geolocation').addClass('geolocation-sidebar-on');

      } else {
        $sidebar.removeClass('on');
        $('#legend').removeClass('legend-mobile');
        $sidebar.addClass('closed');
        $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
        $('div.gmnoprint[controlheight="55"], div.gmnoprint[controlheight="66"], .gm-svpc').removeClass('gm-sidebar-on');
        $('#geolocation').removeClass('geolocation-sidebar-on');
        $('#hubzone-qualifications').attr("aria-live", "off");
      }
    };
    /*** Open the sidebar ***/
    $sidebar.open = function() {
      if (!$sidebar.hasClass('on')) {
        $sidebar.update();
      }
    };
    /*** Close the sidebar ***/
    $sidebar.close = function() {
      if ($sidebar.hasClass('on')) {
        $sidebar.update();
      }
    };
    /*** Clear/reset the sidebar ***/
    $sidebar.clear = function() {
        $('.hubzone-sidebar-address').empty();
        $('.hubzone-status-indicator').empty();
        $('.sidebar-qualifications').empty();
        $('.hubzone-sidebar-coordinates').empty();
        $('.hubzone-until-date').empty();
        $('.sidebar-additional-details tbody').empty();
        $('.hubzone-status-date').empty();
        $sidebar.addClass('hidden');
    };
    return $sidebar;
  };

  return {
    triggerSidebar: function(){
      $('#sidebar').hasClass('on') ? HZApp.GA.track( 'map', 'sidebar', 'hide' ) :
                               HZApp.GA.track( 'map', 'sidebar', 'show' );
      $('#sidebar').hasClass('on') ? HZApp.SidebarUtils.sidebar.close() : HZApp.SidebarUtils.sidebar.open();
    },
    sidebar: {},
    buildSidebar: function(){
      HZApp.SidebarUtils.sidebar = $('#sidebar').sidebar();
      $('#sidebar-button').click(HZApp.SidebarUtils.triggerSidebar);
    },
    //update settings on qualifications to force the screen reader to the qualifications tab
    updateA11yFocus: function(elem){
      elem.attr("aria-live", "rude");
      elem.attr("tabindex", "-1");
      elem.focus();
    }
  };
})();
