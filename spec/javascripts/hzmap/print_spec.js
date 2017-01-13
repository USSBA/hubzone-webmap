//= require hzmap
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */


describe ('Testing print operations', function() {
  beforeEach(function(done) {
    google = HZSpecHelper.google;
    map = new google.maps.Map();
    var sidebar = HZSpecHelper.mockPage.build();
    //set spies
    spyOn(map, 'getBounds');
    spyOn(map, 'getCenter');
    spyOn(map, 'getZoom');
    spyOn(map, 'fitBounds');
    spyOn(map, 'setCenter');
    spyOn(map, 'setZoom');
    spyOn(google.maps.event, 'trigger');
    // spyOn(google.maps, 'Marker');

    hzQueryMarker = new HubzoneMapMarker({icon: null});
    hzUserLocation = new HubzoneMapMarker({icon: null});

    setTimeout(function() {
      done();
    }, 1);
  });

  afterEach(function(done){
    map = {};
    hzQueryMarker = {};
    hzUserLocation = {};
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  //google and map objects are inherited from map_spec.js
  it ("should update the map div before print with no marker present", function(){
    // fails at http://localhost:3000/specs?random=true&seed=64916
    mapMarkers = [];
    beforePrint();

    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.getBounds.calls.count()).toEqual(1);
    expect(map.getCenter.calls.count()).toEqual(1);
    expect(map.getZoom.calls.count()).toEqual(1);
    expect(map.fitBounds.calls.count()).toEqual(1);
    expect(map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');
  });

  it ("should update the map div before print with a marker present", function(){
    var stubMapMarker = new HZSpecHelper.MapMarker();
    mapMarkers = [stubMapMarker];
    beforePrint();
    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.getBounds.calls.count()).toEqual(1);
    expect(map.getCenter.calls.count()).toEqual(1);
    expect(map.getZoom.calls.count()).toEqual(1);
    expect(map.fitBounds.calls.count()).toEqual(1);
    expect(map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');
  });

  it ("should reset the map view", function(){
    beforePrint();
    afterPrint();
    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.setCenter.calls.count()).toEqual(2);
    expect(map.setZoom.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(2);
    expect(mapBodyDivClasses).not.toContain('print');
  });

  it ("should run beforePrint then window.Print", function(){
    var printEvent = {
      preventDefault: function(){}
    };
    spyOn(printEvent, 'preventDefault');
    spyOn(window, 'beforePrint');
    //basically mocks setTimeout since I couldn't get it to
    // run print
    spyOn(window, 'setTimeout').and.callFake(function(fn){
      fn.apply(null, arguments);
      return;
    });
    spyOn(window, 'print');

    catchPrintEvent(printEvent, 1);
    expect(printEvent.preventDefault.calls.count()).toEqual(1);
    expect(window.beforePrint.calls.count()).toEqual(1);
    expect(window.setTimeout.calls.count()).toEqual(1);
    expect(window.print.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on ctrl-p", function(){
    spyOn(window, 'catchPrintEvent');

    var printE = {
      ctrlKey: true,
      metaKey: false,
      keyCode: 80
    };
    catchKeyStrokeToPrint(printE);
    expect(window.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should trigger catchPrintEvent on cmd-p", function(){
    spyOn(window, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: true,
      keyCode: 80
    };
    catchKeyStrokeToPrint(printE);
    expect(window.catchPrintEvent.calls.count()).toEqual(1);
  });

  it ("should do nothing on other key strokes", function(){
    spyOn(window, 'catchPrintEvent');

    var printE = {
      ctrlKey: false,
      metaKey: false,
      keyCode: 80
    };
    catchKeyStrokeToPrint(printE);
    expect(window.catchPrintEvent.calls.count()).toEqual(0);
  });

  it ("should handle after print media query", function(){
    spyOn(window, 'afterPrint');

    var mql = {
      matches: false
    };
    catchMediaQuery(mql);
    expect(window.afterPrint.calls.count()).toEqual(1);
  });

  it ("should ignore before print media query", function(){
    spyOn(window, 'afterPrint');

    var mql = {
      matches: true
    };
    catchMediaQuery(mql);
    expect(window.afterPrint.calls.count()).toEqual(0);
  });
});
