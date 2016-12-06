// code for handling marker behavior

// Removes the markers from the map
function clearMarkers() {
  mapMarkers = [];
  return mapMarkers;
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < mapMarkers.length; i++) {
    mapMarkers[i].setMap(map);
  }
  clearMarkers();
}

// add a marker to the map, removing any other markers
/* exported updateMarkers */
function updateMarkers(geocodeLocation){
  
  if (geocodeLocation !== null && geocodeLocation !== undefined){
    setMapOnAll(null);
    var marker = new google.maps.Marker({
      position: geocodeLocation,
      map: mapScope,
      icon: new google.maps.MarkerImage('/assets/hubzone-map-marker.svg')
    });
    mapMarkers.push(marker);
  } else {
    mapMarkers = clearMarkers();
  }
  return mapMarkers;
}
