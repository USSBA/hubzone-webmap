/* exported GeoLocation */
var GeoLocation = (function() {
	// Geolocation button listener
	$(function() {
	  $('#geolocation').click(GeoLocation.getLocation);
	});

  return {
    getLocation: function( ) {
   		GeoLocation.getUserLocation(window.navigator.geolocation); 
    },
    getUserLocation: function(navLocation){
		  //grab users location and set map around it
		  // $('#geolocation img').css("display", "none");
		  // $('.spinner').css("display", "block");
		  if (navLocation) {
		      navLocation.getCurrentPosition(this.moveMapToUserLocation);
		      return navLocation;
		  } else {
		    //browser doesn't support Geolocation
		    // console.warn('browser does not support geolocation');
		    return null;
		  }
    },
    moveMapToUserLocation: function(position){
		  var pos = {
		    lat: position.coords.latitude,
		    lng: position.coords.longitude
		  };
		  //set map to that location
		  map.setCenter(pos);
		  map.setZoom(15);
		  hzUserLocation.updateMarkers(pos);
		  // $('#geolocation img').css("display", "block");
		  // $('.spinner').css("display", "none");
    }
  };
})();
