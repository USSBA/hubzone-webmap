/* Geolocation button listener */
$(function() {
  $('#geolocation').click(getLocation);
});

function getLocation() {
   getUserLocation(navigator.geolocation);
}
