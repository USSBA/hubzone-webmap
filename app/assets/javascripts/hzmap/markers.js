// code for handling marker behavior

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
  mapMarkers = [];
};

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < mapMarkers.length; i++) {
    mapMarkers[i].setMap(map);
  }
};

// add a marker to the map, removing any other markers
function updateMarkers(geocodeLocation){
  clearMarkers();
  if (geocodeLocation !== null && geocodeLocation !== undefined){
    var marker = new google.maps.Marker({
      position: geocodeLocation,
      map: mapScope,
      icon: new google.maps.MarkerImage('/assets/hubzone-map-marker.svg')
    });

    mapMarkers.push(marker);
  }
};



