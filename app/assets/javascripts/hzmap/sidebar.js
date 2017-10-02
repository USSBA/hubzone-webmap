//Sidebar utils
HZApp.SidebarUtils = (function(){

  // forEach polyfill for IE
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, argument) {
      argument = argument || window;
      for (var i = 0; i < this.length; i++) {
          callback.call(argument, this[i], i, this);
      }
    };
  }

  //bind listener for clickable map marker
  $(function() {
    $(document).on('click','#hubzone-clickable-marker', function () {
        HZApp.SidebarUtils.centerMapMarker(HZApp.HashUtils.parseLocationHash(location.hash), HZApp.HZQuery.response.geocodeLocation);
    });
  });

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

      var currentlyHidden = document.querySelector('span.additional-details-expand.hide').hidden;

      if (sidebarAccordionCookie === null || sidebarAccordionCookie === 'false'){
        if (!currentlyHidden) {
          HZApp.SidebarUtils.setAccordionOpenState(elem, false, 'hide');
        }
      } else {
        if (currentlyHidden) {
          HZApp.SidebarUtils.setAccordionOpenState(elem, true, 'show');
        }
      }
    },
    triggerAccordion: function(triggerElem){
      var elem = $(triggerElem.currentTarget);
      var action = elem.data('action');

      if( action === 'show' ) {
        HZApp.SidebarUtils.setAccordionOpenState(elem, true, action);
      } else if ( action === 'hide' ) {
        HZApp.SidebarUtils.setAccordionOpenState(elem, false, action);
      }
      HZApp.GA.track( 'map', 'sidebar', 'details-' + action );
    },
    setAccordionOpenState: function(elem, visibleState, action){
      // set the cookie
      HZApp.Cookies.removeItem('hz-sbq-open');
      HZApp.Cookies.setItem('hz-sbq-open', visibleState);

      // update the accordion statuse
      var detailsRows = document.querySelectorAll('.designation-details-row');

      detailsRows.forEach(function(detail){
        detail.hidden = !visibleState;
      });

      // update the button link
      document.querySelector('span.additional-details-expand.show').hidden = (action === 'show' ? true : false);
      document.querySelector('span.additional-details-expand.hide').hidden = (action === 'hide' ? true : false);
    },
    centerMapMarker: function(hash, geocodeLatLng) {
      // if a query is present, get the response geocode, parse it, and update the center
      if ( hash.q ) {
        var parsedLatLng = JSON.stringify(geocodeLatLng.lat) + "," + JSON.stringify(geocodeLatLng.lng);
        HZApp.Router.updateCenter(parsedLatLng);
      // use latlng if present
      } else if ( hash.latlng ) {
        HZApp.Router.updateCenter(hash.latlng);
      }
    }
  };
})();
