// Catch control+p and re-layout page for printing
$(document).bind("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.keyCode == 80){
    moveit();
    window.setTimeout(function(){
      window.print()
    }, 500);
  }
});

// Listener for map icon click
$(function() {
  $('#map-print').click(function() {
    console.log('print button selected');
    moveit();
    window.setTimeout(function(){
      window.print()
    }, 500);
  });
});

var moveit = function(){
  var bounds = map.getBounds();
  var center = map.getCenter();
  $('.map-body').width(300);
  $('.map-body').height(300);
  google.maps.event.trigger(map, 'resize');
  map.fitBounds(bounds);
  if (mapMarkers.length > 0){
    map.setCenter(mapMarkers[0].position);
  } else {
    map.setCenter(center);
  }
  sidebar.close()
}


