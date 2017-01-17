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

    HZApp.Markers.hzQueryMarker = new HZApp.Constructors.HubzoneMapMarker({icon: null});
    HZApp.Markers.hzUserLocation = new HZApp.Constructors.HubzoneMapMarker({icon: null});

    setTimeout(function() {
      done();
    }, 1);
  });

  afterEach(function(done){
    HZApp.map = {};
    HZApp.Markers.hzQueryMarker = {};
    HZApp.Markers.hzUserLocation = {};
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  //google and map objects are inherited from map_spec.js
  it ("should update the map div before print with no marker present", function(){
    // fails at http://localhost:3000/specs?random=true&seed=64916
    mapMarkers = [];
    HZApp.Print.beforePrint();

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
    HZApp.Markers.hzQueryMarker.updateMarkers(HZSpecHelper.markerLocation);
    HZApp.Print.beforePrint();
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
    HZApp.Print.beforePrint();
    HZApp.Print.afterPrint();
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
    spyOn(HZApp.Print, 'beforePrint');
    //basically mocks setTimeout since I couldn't get it to
    // run print
    spyOn(window, 'setTimeout').and.callFake(function(fn){
      fn.apply(null, arguments);
      return;
    });
    spyOn(window, 'print');

    HZApp.Print.catchPrintEvent(printEvent, 1);
    expect(printEvent.preventDefault.calls.count()).toEqual(1);
    expect(HZApp.Print.beforePrint.calls.count()).toEqual(1);
    expect(window.setTimeout.calls.count()).toEqual(1);
    expect(window.print.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on ctrl-p", function(){
    spyOn(HZApp.Print, 'catchPrintEvent');

    var printE = {
      ctrlKey: true,
      metaKey: false,
      keyCode: 80
    };
    HZApp.Print.catchKeyStrokeToPrint(printE);
    expect(HZApp.Print.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on cmd-p", function(){
    spyOn(HZApp.Print, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: true,
      keyCode: 80
    };
    HZApp.Print.catchKeyStrokeToPrint(printE);
    expect(HZApp.Print.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should do nothing on other key strokes", function(){
    spyOn(HZApp.Print, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: false,
      keyCode: 80
    };
    HZApp.Print.catchKeyStrokeToPrint(printE);
    expect(HZApp.Print.catchPrintEvent.calls.count()).toEqual(0);
  });

  it ("should trigger printing ", function(){
    spyOn(HZApp.Print, 'beforePrint');
    spyOn(HZApp.Print, 'waitToPrint');

    var printE = {
      preventDefault: function(){}
    };

    HZApp.Print.catchPrintEvent(printE);
    expect(HZApp.Print.beforePrint.calls.count()).toEqual(1);
    expect(HZApp.Print.waitToPrint.calls.count()).toEqual(1);
    expect(HZApp.Print.waitToPrint.calls.allArgs()[0][0]).toEqual(1000);
  });

  it ("should handle after print media query", function(){
    spyOn(HZApp.Print, 'afterPrint');

    var mql = {
      matches: false
    };
    HZApp.Print.catchMediaQuery(mql);
    expect(HZApp.Print.afterPrint.calls.count()).toEqual(1);
  });

  it ("should ignore before print media query", function(){
    spyOn(HZApp.Print, 'afterPrint');

    var mql = {
      matches: true
    };
    HZApp.Print.catchMediaQuery(mql);
    expect(HZApp.Print.afterPrint.calls.count()).toEqual(0);
  });
});
