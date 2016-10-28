console.log("In the map controller");


//create the map on load and handle styling, build in event listeners
function initMap() {
  // Styles a map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.5, lng: -97.5},
    zoom: 9,
    zoomControl: true, 
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  return map;

};