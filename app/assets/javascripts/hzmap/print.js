// Container for map bounds so we can reset it after print
HZApp.Print = (function(){
  (function initialize(){
    // Catch control+p and re-layout page for printing
    $(document).bind("keydown", HZApp.Print.catchKeyStrokeToPrint);

    // Listener for map icon click
    $(function() {
      // Web-kit
      this.mediaQueryList = window.matchMedia('print');
      this.mediaQueryList.addListener(HZApp.Print.catchMediaQuery);
      $(document).on('click','#map-print', HZApp.Print.catchPrintEvent);
    });
  })();

  return {
    mapBounds: {},
    mapCenter: {},
    mapZoom: null,
    catchKeyStrokeToPrint: function(e){
      if((e.ctrlKey || e.metaKey) && e.keyCode === 80){
        HZApp.Print.catchPrintEvent(e, 1000);
      } else {
        return;
      }
    },
    catchPrintEvent: function(e, wait){
      e.preventDefault();
      wait = wait || 1000;
      HZApp.Print.beforePrint();
      HZApp.Print.waitToPrint(wait);
    },
    waitToPrint: function(wait){
      window.setTimeout(function(){
        window.print();
      }, wait);
    },
    catchMediaQuery: function(mql){
      if (!mql.matches) {
          HZApp.Print.afterPrint();
      } else {
        return;
      }
    },
    beforePrint: function() {  // Rebuild the map before printing
      this.mapBounds = HZApp.map.getBounds();
      this.mapCenter = HZApp.map.getCenter();
      this.mapZoom = HZApp.map.getZoom();

      $('.map-body').addClass('printable-map');
      google.maps.event.trigger(HZApp.map, 'resize');
      HZApp.map.fitBounds(this.mapBounds);

      if (HZApp.Markers.hzQueryMarker.markers.length > 0){
        HZApp.map.setCenter(HZApp.Markers.hzQueryMarker.markers[0].position);
      } else {
        HZApp.map.setCenter(this.mapCenter);
      }
      sidebar.close();
    },
    afterPrint: function() {  //reset the map after print
      $('.map-body').removeClass('printable-map');
      google.maps.event.trigger(HZApp.map, 'resize');
      HZApp.map.setCenter(this.mapCenter);
      HZApp.map.setZoom(this.mapZoom);
      sidebar.open();
    }
  };
})();






