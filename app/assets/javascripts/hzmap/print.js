//container for map bounds so we can reset it after print
var mapBounds = {};
var mapCenter = {};

// Catch control+p and re-layout page for printing
$(document).bind("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.keyCode === 80){
    catchPrintEvent();
  }
});

// Listener for map icon click
$(function() {
  $('#map-print').click(function() {
    console.log('print button selected');
    catchPrintEvent();
  });
});

//handle the print event
function catchPrintEvent(){
  beforePrint();
  window.setTimeout(function(){
    window.print();
  }, 1000);
}

var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql) {
  if (!mql.matches) {
      afterPrint();
  }
});


//rebuild the map before printing
function beforePrint() {
    console.log('Before printing: ');
    var mapBounds = map.getBounds();
    var mapCenter = map.getCenter();
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
function afterPrint() {
    console.log('After printing: ');
    $('.map-body').removeClass('print');
    google.maps.event.trigger(map, 'resize');
    // map.setCenter(mapCenter);
    map.fitBounds(mapBounds);
    sidebar.open();
    $('#sidebar button.usa-accordion-button').map(clickAccordion);
}

//helper for triggering accordions
function clickAccordion(index, el){
  $(el).trigger('click');
}
