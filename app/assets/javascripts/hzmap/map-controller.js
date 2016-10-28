console.log("In the map controller");


//create the map on load and handle styling, build in event listeners
function initMap() {
  
  $.getJSON('./config/gray_style.json').then(function(resp) {
    var googleMapsStyleConfig = resp;

    // Styles a map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.5, lng: -97.5},
      zoom: 9,
      styles: googleMapsStyleConfig,
      zoomControl: true, 
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });  

    //adds listener for map idle, to fetch based on new bounds and refetch map, then redraw as needed
    //this loses scope occasionally in chrome, and always in firefox and safari.  
    //wonder if maybe it is a scope or an aysync thing (map not created yet)
    map.addListener('idle', updateMap, map);


    return map;

  });

};