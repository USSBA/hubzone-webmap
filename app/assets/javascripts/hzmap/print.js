// Container for map bounds so we can reset it after print
var mapBounds = {};
var mapCenter = {};
var mapZoom = null;

// Catch control+p and re-layout page for printing
$(document).bind("keydown", catchKeyStrokeToPrint);

function catchKeyStrokeToPrint(e){
  if((e.ctrlKey || e.metaKey) && e.keyCode === 80){
    catchPrintEvent(e, 1000);
  } else {
    return;
  }
}

// Listener for map icon click
$(function() {
  $(document).on('click','#map-print', catchPrintEvent);
});

// Handle the print event
function catchPrintEvent(e, wait){
  e.preventDefault();
  wait = wait || 1000;
  beforePrint();
  window.setTimeout(function(){
    window.print();
  }, wait);
}

// Web-kit
var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(catchMediaQuery);

//helper for catching the media query
function catchMediaQuery(mql){
  if (!mql.matches) {
      afterPrint();
  } else {
    return;
  }
}

// window.onbeforeprint = function() {
//   catchPrintEvent(1000);
// };
// window.onafterprint = function() {
//   afterPrint(mapBounds);
// };

// Rebuild the map before printing
function beforePrint() {
  mapBounds = map.getBounds();
  mapCenter = map.getCenter();
  mapZoom = map.getZoom();

  $('.map-body').addClass('printable-map');
  google.maps.event.trigger(map, 'resize');
  map.fitBounds(mapBounds);

  if (hzQueryMarker.markers.length > 0){
    map.setCenter(hzQueryMarker.markers[0].position);
  } else {
    map.setCenter(mapCenter);
  }

  sidebar.close();
}

//reset the map after print
function afterPrint() {
  $('.map-body').removeClass('printable-map');
  google.maps.event.trigger(map, 'resize');
  map.setCenter(mapCenter);
  map.setZoom(mapZoom);
  sidebar.open();
}
