//= require hzmap
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */


describe ('Testing print operations', function() {
  beforeEach(function(done) {
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
    var sidebar = HZSpecHelper.mockPage.build();
    //set spies
    spyOn(HZApp.map, 'getBounds');
    spyOn(HZApp.map, 'getCenter');
    spyOn(HZApp.map, 'getZoom');
    spyOn(HZApp.map, 'fitBounds');
    spyOn(HZApp.map, 'setCenter');
    spyOn(HZApp.map, 'setZoom');
    spyOn(google.maps.event, 'trigger');
    // spyOn(google.maps, 'Marker');

    HZApp.markers.hzQueryMarker = new HZApp.constructors.HubzoneMapMarker({icon: null});
    HZApp.markers.hzUserLocation = new HZApp.constructors.HubzoneMapMarker({icon: null});

    setTimeout(function() {
      done();
    }, 1);
  });

  afterEach(function(done){
    HZApp.map = {};
    HZApp.markers.hzQueryMarker = {};
    HZApp.markers.hzUserLocation = {};
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  //google and map objects are inherited from map_spec.js
  it ("should update the map div before print with no marker present", function(){
    // fails at http://localhost:3000/specs?random=true&seed=64916
    mapMarkers = [];
    HZApp.print.beforePrint();

    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(HZApp.map.getBounds.calls.count()).toEqual(1);
    expect(HZApp.map.getCenter.calls.count()).toEqual(1);
    expect(HZApp.map.getZoom.calls.count()).toEqual(1);
    expect(HZApp.map.fitBounds.calls.count()).toEqual(1);
    expect(HZApp.map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');
  });

  it ("should update the map div before print with a marker present", function(){
    var stubMapMarker = new HZApp.constructors.HubzoneMapMarker({icon: null});  
    var stubGoogleMarker = new HZSpecHelper.MapMarker();
    stubMapMarker.markers.push(stubGoogleMarker);

    HZApp.print.beforePrint();
    var mapBodyDivClasses = $('.map-body').attr('class');
    expect(HZApp.map.getBounds.calls.count()).toEqual(1);
    expect(HZApp.map.getCenter.calls.count()).toEqual(1);
    expect(HZApp.map.getZoom.calls.count()).toEqual(1);
    expect(HZApp.map.fitBounds.calls.count()).toEqual(1);
    expect(HZApp.map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');
  });

  it ("should reset the map view", function(){
    HZApp.print.beforePrint();
    HZApp.print.afterPrint();
    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(HZApp.map.setCenter.calls.count()).toEqual(2);
    expect(HZApp.map.setZoom.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(2);
    expect(mapBodyDivClasses).not.toContain('print');
  });

  it ("should run beforePrint then window.Print", function(){
    var printEvent = {
      preventDefault: function(){}
    };
    spyOn(printEvent, 'preventDefault');
    spyOn(HZApp.print, 'beforePrint');
    //basically mocks setTimeout since I couldn't get it to
    // run print
    spyOn(window, 'setTimeout').and.callFake(function(fn){
      fn.apply(null, arguments);
      return;
    });
    spyOn(window, 'print');

    HZApp.print.catchPrintEvent(printEvent, 1);
    expect(printEvent.preventDefault.calls.count()).toEqual(1);
    expect(HZApp.print.beforePrint.calls.count()).toEqual(1);
    expect(window.setTimeout.calls.count()).toEqual(1);
    expect(window.print.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on ctrl-p", function(){
    spyOn(HZApp.print, 'catchPrintEvent');

    var printE = {
      ctrlKey: true,
      metaKey: false,
      keyCode: 80
    };
    HZApp.print.catchKeyStrokeToPrint(printE);
    expect(HZApp.print.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on cmd-p", function(){
    spyOn(HZApp.print, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: true,
      keyCode: 80
    };
    HZApp.print.catchKeyStrokeToPrint(printE);
    expect(HZApp.print.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should do nothing on other key strokes", function(){
    spyOn(HZApp.print, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: false,
      keyCode: 80
    };
    HZApp.print.catchKeyStrokeToPrint(printE);
    expect(HZApp.print.catchPrintEvent.calls.count()).toEqual(0);
  });

  it ("should handle after print media query", function(){
    spyOn(HZApp.print, 'afterPrint');

    var mql = {
      matches: false
    };
    HZApp.print.catchMediaQuery(mql);
    expect(HZApp.print.afterPrint.calls.count()).toEqual(1);
  });

  it ("should ignore before print media query", function(){
    spyOn(HZApp.print, 'afterPrint');

    var mql = {
      matches: true
    };
    HZApp.print.catchMediaQuery(mql);
    expect(HZApp.print.afterPrint.calls.count()).toEqual(0);
  });
});
