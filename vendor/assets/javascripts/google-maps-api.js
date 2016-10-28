// var map = {};
// var mapMarker = {};
// var infoWindow = {};
// var apiKey = 'AIzaSyCpZgPsZxJzCFXoLpduWMeDRssxFKr6kR0';

// // callback from index.html to execute the geocode command
// function geocode(ev){
//   var geocodeQuery = document.getElementById("query-input").value;
//   console.log(geocodeQuery);


//   $.ajax({
//     url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
//          geocodeQuery +
//          '&key=' + apiKey,
//     success: parseGeocodeResult,
//     error: geocodingError
//   });
// };

// //parse the geocoder result and pass the first one to the jumpToLocation
// function parseGeocodeResult(ev){
//   console.log(ev.status);
//   if (ev.status === "OK"){
//     console.log(ev, "geocode ok");

//     $('#geocodingResults').html('');
//     ev.results.forEach(function(result) {
//       $('#geocodingResults').append(
//         '<p onclick="parseLocationFromElement(this)"'+
//         'data-coord=' + JSON.stringify(result.geometry.location) + '>' + result.formatted_address + '</p>');
//     });

//     jumpToLocation(ev.results[0].geometry.location);
//   }
// };

// // move map and display geocoding results if the ajax is successful
// // does not have special handling for no results, except it just doesn't
// // do anything
// function jumpToLocation(geocodeLocation){

//   map.setCenter(geocodeLocation);
//   if (Object.keys(mapMarker).length > 0){
//     mapMarker.setMap(null);
//   }
//   mapMarker = new google.maps.Marker({
//     position: geocodeLocation
//   });
//   mapMarker.setMap(map);

// };

// //callback for when they click on a table result, takes event and access the data property
// function parseLocationFromElement(ev){
//   jumpToLocation($(ev).data('coord'));
// };

// //if the geocoder comes back with any error state
// function geocodingError(ev){
//   console.log("geocoding error");
// };

// //callback for building a popup on map data click
// function showPopUp(ev){
//   console.log('map data clicked');
//   if (infoWindow.getContent !== undefined){
//     infoWindow.setContent('');
//     infoWindow.close();
//   }
//   var popUpTemplate = '';
//   ev.feature.forEachProperty( function(val,key) {
//     popUpTemplate += '<li class=no-bullet><b>' + key + ':</b>  ' + val + '</li>';
//   });

//   infoWindow.setContent(popUpTemplate);
//   infoWindow.setPosition(ev.latLng);
//   infoWindow.open(map);

// };

// //create the map on load and handle styling, build in event listeners
// function initMap() {

//   $.getJSON('./config/google-maps-style-config.json').then(function(resp) {
//     var googleMapsStyleConfig = resp;

//     // Styles a map in night mode.
//     map = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: 35.5, lng: -97.5},
//       zoom: 9,
//       styles: googleMapsStyleConfig
//     });

//     map.data.loadGeoJson('/data/2015-indian-lands.geojson');

//     map.data.setStyle(function(feature) {
//       //here could access individual feature properties to define styles based on specific attribites
//       var geoid = parseInt(feature.getProperty('GEOID'));
//       var color = geoid > 5000 ? '#0071bc' : '#323a45';
//       return {
//         fillColor: color,
//         strokeWeight: 1
//       }
//     });


//     map.data.addListener('click', showPopUp);

//     infoWindow = new google.maps.InfoWindow;

//     // map.addListener('zoom_changed', function(){
//     //   var currentZoom = map.getZoom();

//     //   if (currentZoom > 15) {
//     //     map.set('styles', [
//     //       {
//     //         featureType: 'poi.park',
//     //         elementType: 'geometry',
//     //         stylers: [{color: '#ff0000'}]
//     //       }
//     //     ]);
//     //   } else {
//     //     map.set('styles', [
//     //       {
//     //         featureType: 'poi.park',
//     //         elementType: 'geometry',
//     //         stylers: [{color: '#00ff00'}]
//     //       }
//     //     ]);
//     //   }
//     // });

//     return map;
//   });
// };
