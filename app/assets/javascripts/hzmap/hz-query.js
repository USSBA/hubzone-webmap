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

    // handle bad responses
    this.handleBadResponses(response.status);
    
    // get all the desired geometry and attributes out of the response
    this.parseResponseGeometry(this.response);
    
    //finally, update the map with the new response
    this.updateMap();
  },
  handleBadResponses: function(responseStatus){
    this.query.latlng = null; 
    this.query.q = null;
    if (responseStatus === 'ZERO_RESULTS' || responseStatus === 'INVALID_REQUEST'){
      $('.sidebar-card.map-report').hide();
    } else {
      $('.sidebar-card.map-report').show();
    }
  },
  parseResponseGeometry: function(response){
    this.response.geocodeLocation = null;
    if (HZApp.HZQuery.response.geometry){
      HZApp.MapUtils.jumpToLocation({
        viewport: response.geometry.viewport,
        location: response.geometry.location
      });

      this.response.geocodeLocation = response.geometry.location;
      
      if (response.place_id){
        this.query.q = response.formatted_address;
        this.query.latlng = null;
      } else {
        this.query.q = null;
        this.query.latlng = [response.geocodeLocation.lat, response.geocodeLocation.lng ].join(',');
      }
    }
  },
  updateMap: function(){
    HZApp.SidebarUtils.sidebar.open();
    HZApp.Markers.hzQueryMarker.updateMarkers(this.response.geocodeLocation);
  }
};
