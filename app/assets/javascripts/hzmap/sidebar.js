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
        if( $('div.gmnoprint[controlheight="81"], div.gmnoprint[controlheight="40"], .gm-svpc') ) {
          console.log("found something");
        } else {
          console.log("didn't find anything");
        }
        $('div.gmnoprint[controlheight="81"], div.gmnoprint[controlheight="40"], .gm-svpc').addClass('gm-sidebar-on');
        $('#geolocation').addClass('geolocation-sidebar-on');

      } else {
        $sidebar.removeClass('on');
        $('#legend').removeClass('legend-mobile');
        $sidebar.addClass('closed');
        $('#sidebar-button').html('<i class="fa fa-chevron-left"></i>');
        $('div.gmnoprint[controlheight="81"], div.gmnoprint[controlheight="40"], .gm-svpc').removeClass('gm-sidebar-on');
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
      var sidebarAccordionCookie = HZApp.Cookies.getItem(elem.data('cookie'));

      var hide_selector = ['span' + elem.selector, 'hide'].join('.');
      var currentlyHidden = document.querySelector(hide_selector).hidden;

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
      HZApp.Cookies.removeItem(elem.data('cookie'));
      HZApp.Cookies.setItem(elem.data('cookie'), visibleState);

      // update the accordion status
      var detailsRows = document.querySelectorAll('.' + elem.data('expands') + ' ' + '.details-row');

      detailsRows.forEach(function(detail){
        detail.hidden = !visibleState;
      });

      // TODO: I think we want to refactor this here to be more generic for different types of details-expand things
      elem.each(function(e) {
        if (elem[e].classList.contains(action)) {
          var show_selector = ['span', elem[e].classList[0], 'show'].join('.');
          var hide_selector = ['span', elem[e].classList[0], 'hide'].join('.');

          // update the button link
          document.querySelector(show_selector).hidden = (action === 'show' ? true : false);
          document.querySelector(hide_selector).hidden = (action === 'hide' ? true : false);
        }
      });
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
