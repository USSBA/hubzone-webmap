/* exported GeoLocation */
HZApp.GeoLocation = (function() {
	// GeoLocation button listener
	$(function() {
	  $('#geolocation').click(function(){
	  	HZApp.GeoLocation.getUserLocation(window.navigator.geolocation);
	  });
	});

  return {
    getUserLocation: function(navLocation){
		  //grab users location and set map around it
  		$('#geolocation i').css("display", "none");
  		$('.geolocation-loading').css("display", "block");
		  if (navLocation) {
		      navLocation.getCurrentPosition(this.moveMapToUserLocation, this.geolocationError);
		      return navLocation;
		  } else {
		    //browser doesn't support Geolocation
        $('#geolocation i').css("display", "block");
    		$('.geolocation-loading').css("display", "none");
		    // window.console.warn('browser does not support geolocation');
		    return null;
		  }
    },
    geolocationError: function() {
	    $('#geolocation i').css("display", "block");
	    $('.geolocation-loading').css("display", "none");
	    window.console.log("unable to retrieve user location");
		},
    moveMapToUserLocation: function(position){
		  var pos = {
		    lat: position.coords.latitude,
		    lng: position.coords.longitude
		  };
		  //set map to that location
		  HZApp.map.setCenter(pos);
		  HZApp.map.setZoom(15);
		  HZApp.Markers.hzUserLocation.updateMarkers(pos);
		  $('#geolocation i').css("display", "block");
		  $('.geolocation-loading').css("display", "none");
    }
  };
})();
