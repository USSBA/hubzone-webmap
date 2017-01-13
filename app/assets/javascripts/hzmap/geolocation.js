/* exported GeoLocation */
HZApp.utils.GeoLocation = (function() {
	// GeoLocation button listener
	$(function() {
	  $('#geolocation').click(function(){
	  	HZApp.utils.GeoLocation.getUserLocation(window.navigator.geolocation);
	  });
	});

  return {
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
		  HZApp.map.setCenter(pos);
		  HZApp.map.setZoom(15);
		  HZApp.markers.hzUserLocation.updateMarkers(pos);
		  // $('#geolocation img').css("display", "block");
		  // $('.spinner').css("display", "none");
    }
  };
})();
