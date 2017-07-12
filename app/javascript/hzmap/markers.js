// // code for handling marker behavior

/* exported HubzoneMapMarker */
HZApp.Constructors.HubzoneMapMarker = function(options) {
  this.markers = [];
  this.clearMarkers = function() {
    this.setMapOnAll(null);
    this.markers = [];
  };
  this.setMapOnAll = function(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  };

  this.updateMarkers = function(geocodeLocation){
    this.clearMarkers();
    if (geocodeLocation !== null && geocodeLocation !== undefined){
      var marker = new google.maps.Marker({
        position: geocodeLocation,
        map: HZApp.map,
        icon: {
          url: options.icon,
          scaledSize: new google.maps.Size(options.scaledSize,options.scaledSize)
        },
        optimized: false
      });
      google.maps.event.addListener(marker, 'click', HZApp.MapUtils.catchMapClick);
      this.markers.push(marker);
    }
  };

};
