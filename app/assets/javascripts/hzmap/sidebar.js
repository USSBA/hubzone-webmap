//Sidebar utils
HZApp.SidebarUtils = (function(){  
  // extend jquery with our sidebar function
  $.fn.sidebar = function() {
    var $sidebar = this;
    this.currentClass = 'hidden';

    this.update = function() {
      if (!$sidebar.hasClass('on')) {
        $sidebar.addClass('on');
        $('#legend').addClass('legend-mobile');
        $sidebar.removeClass('hidden');
        $('#sidebar-button').html('<i class="fa fa-chevron-right"></i>');
        $('div.gmnoprint[controlheight="55"], div.gmnoprint[controlheight="66"], .gm-svpc').addClass('gm-sidebar-on');
        $('#geolocation').addClass('geolocation-sidebar-on');
        this.currentClass = 'on';
      } else {
        $sidebar.removeClass('on');
        $('#legend').removeClass('legend-mobile');
        $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
        $('div.gmnoprint[controlheight="55"], div.gmnoprint[controlheight="66"], .gm-svpc').removeClass('gm-sidebar-on');
        $('#geolocation').removeClass('geolocation-sidebar-on');
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
    }
  };
})();

