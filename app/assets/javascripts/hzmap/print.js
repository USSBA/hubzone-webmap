//container for map bounds so we can reset it after print
var mapBounds = {};
var mapCenter = {};
var mapZoom = null;

// Catch control+p and re-layout page for printing
$(document).bind("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.keyCode === 80){
    catchPrintEvent(1000);
  }
});

// Listener for map icon click
$(function() {
  $('#map-print').click(function() {
    console.log('print button selected');
    catchPrintEvent(1000);
  });
});

//handle the print event
function catchPrintEvent(wait){
  beforePrint();
  window.setTimeout(function(){
    window.print();
  }, wait);
}

//web-kit
var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql){  
  if (!mql.matches) {
      afterPrint(mapBounds);
  } else {
    // catchPrintEvent(2000);
  }
});

// window.onbeforeprint = function() {
//     console.log('This will be called before the user prints.');
// };
// window.onafterprint = function() {
//     console.log('This will be called after the user prints');   
// };


//rebuild the map before printing
function beforePrint() {
    console.log('Before printing: ');
    mapBounds = map.getBounds();
    mapCenter = map.getCenter();
    mapZoom = map.getZoom();
    $('.map-body').addClass('print');
    google.maps.event.trigger(map, 'resize');
    map.fitBounds(mapBounds);
    if (mapMarkers.length > 0){
      map.setCenter(mapMarkers[0].position);
    } else {
      map.setCenter(mapCenter);
    }
    sidebar.close();
    $('#sidebar button.usa-accordion-button').map(clickAccordion);

}

//reset the map after print
function afterPrint(mapBounds) {
    console.log('After printing: ');
    $('.map-body').removeClass('print');
    google.maps.event.trigger(map, 'resize');
    map.setCenter(mapCenter);
    map.setZoom(mapZoom);
    sidebar.open();
    $('#sidebar button.usa-accordion-button').map(clickAccordion);
}

//helper for triggering accordions
function clickAccordion(index, el){
  $(el).trigger('click');
}
