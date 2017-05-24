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
      $('.clearable').empty();
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
    },
    updateAccordion: function(elem){
      this.bindAccordion(elem);
      this.setAccordionStateFromCookie(elem);
    },
    bindAccordion: function (elem) {
      elem.on('click', HZApp.SidebarUtils.triggerAccordion);
    },
    setAccordionStateFromCookie: function(elem){
      var sidebarAccordionCookie = HZApp.Cookies.getItem('hz-sbq-open');

      if (sidebarAccordionCookie === null || sidebarAccordionCookie === 'false'){
        HZApp.SidebarUtils.setAccordionOpenState(elem, false);
      } else {
        HZApp.SidebarUtils.setAccordionOpenState(elem, true);
      }
    },
    triggerAccordion: function(triggerElem){
      var elem = $(triggerElem.currentTarget);
      var accordionIsOpen = elem.attr('aria-expanded');

      if( accordionIsOpen === 'false' ) {
        HZApp.SidebarUtils.setAccordionOpenState(elem, true);
      } else if ( accordionIsOpen === 'true' ) {
        HZApp.SidebarUtils.setAccordionOpenState(elem, false);
      }
    },
    setAccordionOpenState: function(elem, state){
      // set the cookie
      HZApp.Cookies.removeItem('hz-sbq-open');
      HZApp.Cookies.setItem('hz-sbq-open', state);

      // update the accordion status
      var accordionID = elem.attr('aria-controls');
      var content = $('#' + accordionID);
      HZApp.GA.track( 'map', 'sidebar', accordionID + '-close' );
      $( 'button[aria-controls=' + accordionID + ']' ).attr('aria-expanded', state.toString() );
      content.attr('aria-hidden', (!state).toString() );
    }
  };
})();
