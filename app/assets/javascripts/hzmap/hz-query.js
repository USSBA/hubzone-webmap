// utils for handling queries
HZApp.HZQuery = {
  query:{
    latlng: null,
    q: null,
    zoom: null,
  },
  response: {},
  parseResponse: function(response) {
    //set the response for later
    this.response = response;
    this.response.geocodeLocation = null;
    this.query.latlng = null;
    this.query.q = null;

    // handle bad responses
    this.handleBadResponses(response.status);

    // get all the desired geometry and attributes out of the response
    this.parseResponseGeometry(this.response);

    //finally, update the map with the new response
    this.updateMap();
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
    if (response.geometry){
      HZApp.MapUtils.jumpToLocation({
        viewport: response.geometry.viewport,
        location: response.geometry.location
      });

      if (response.place_id){
        this.query.q = response.formatted_address;
        this.query.latlng = null;
      } else {
        this.query.q = null;
        this.query.latlng = [response.geometry.location.lat, response.geometry.location.lng ].join(',');
        this.addCoordsToSearchBar(response.geometry.location);
      }

      this.response.geocodeLocation = response.geometry.location;
    }
  },
  addCoordsToSearchBar: function(coords){
    coords = [coords.lat.toFixed(5), coords.lng.toFixed(5)].join(',');
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
