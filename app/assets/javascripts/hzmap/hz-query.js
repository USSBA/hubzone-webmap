// utils for handling queries
HZApp.HZQuery = {
  query:{
    latlng: null,
    q: null,
    zoom: null,
  },
  response: {},
  parseResponse: function(response) {
    // console.log("~~~~~ parseResponse", response);
    //set the response for later
    this.response = response;
    this.response.geocodeLocation = null;
    this.query.latlng = null;
    this.query.q = null;

    // handle bad responses
    this.handleBadResponses(this.response.status);

    // get all the desired geometry and attributes out of the response
    // HZApp.Router.silentHashChange.setSilent(true, 'parseResponseGeometry');
    this.parseResponseGeometry(this.response);

    //finally, update the map with the new response and reset hash listener
    this.updateMap();
    // HZApp.Router.silentHashChange.setSilent(false, 'parseResponse');
  },
  handleBadResponses: function(responseStatus){
    if (responseStatus === 'ZERO_RESULTS' || responseStatus === 'INVALID_REQUEST'){
      $('.sidebar-card.map-actions').hide();
      $('#sidebar-content').addClass('zero-results');
      $('#legend').addClass('zero-results');
    } else {
      $('.sidebar-card.map-actions').show();
      $('#sidebar-content').removeClass('zero-results');
      $('#legend').removeClass('zero-results');
    }
  },
  parseResponseGeometry: function(response){
    // console.log("~~~~~ parseResponseGeometry");
    // console.trace();
    var startingHash = HZApp.HashUtils.parseLocationHash(location.hash);
    if (response.geometry){
      if (response.place_id){
        HZApp.HZQuery.parseGeometryFromAddressSearch(response);
      } else {
        HZApp.HZQuery.parseGeometryFromMapClick(response);
      }

      // console.log("  to jump, or not to jump: " + response.jump);
      if (response.jump === true || HZApp.HashUtils.hashSearchOnly(startingHash)) {
        // console.log("    JUMP! ", response.geometry);
        HZApp.MapUtils.jumpToLocation({
          viewport: response.geometry.viewport,
          location: response.geometry.location
        });
      }

      this.response.geocodeLocation = response.geometry.location;
    }
  },

  // parse the response geometry from an address search
  parseGeometryFromAddressSearch: function(response){
    var hash = location.hash;
    this.query.q = response.formatted_address;
    this.query.latlng = null;
    hash = HZApp.HashUtils.removeHashValue('latlng', location.hash);
    // console.log("      update the hash removing latlng: " + hash);
    hash = HZApp.HashUtils.updateQueryHash(response.search_q, hash);
    // console.log("      update the hash adding query: " + hash);

    // Ugh... Need to set the hash before jumping to location,
    // but first need to change the hash, and set it, if we're jumping.
    if (response.jump === true) {
      hash = HZApp.HashUtils.updateCenterHash(response.geometry.location.lat,
                                              response.geometry.location.lng,
                                              hash);
    // console.log("      updated the hash with the center: " + hash);
    }
    // console.log("    set the hash: " + hash);
    HZApp.Router.setHash(hash);
  },

  // parse the response geometry from a mapclick
  parseGeometryFromMapClick: function(response){
    this.query.q = null;
    this.query.latlng = [response.geometry.location.lat, response.geometry.location.lng ].join(',');
    this.addCoordsToSearchBar(response.geometry.location);
  },

  addCoordsToSearchBar: function(coords){
    coords = [coords.lat.toFixed(6), coords.lng.toFixed(6)].join(',');
    document.getElementById('search-field-small').value = coords;
  },
  updateMap: function(){
    HZApp.SidebarUtils.sidebar.open();
    HZApp.Markers.hzQueryMarker.updateMarkers(this.response.geocodeLocation);
  },
  resetStreetView: function (elem){
    elem.click();
  }
};
