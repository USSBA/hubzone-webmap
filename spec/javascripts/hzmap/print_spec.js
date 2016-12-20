//= require hzmap
//= require ../helpers/sinon-1.17.6
/* jshint unused: false */
/* jshint undef: false */

//define map if it hasn't been already (e.g., if map_spec wasn't run)
if (Object.keys(map).length === 0 ){
  map = {
    getBounds: function() {},
    getCenter: function() {},
    getZoom: function() {},
    fitBounds: function() {},
    setCenter: function() {},
    setZoom: function() {},
    addListener: function() {},
    data: {
      addListener: function() {}
    },
    mapTypes: {
      set: function(){
        return;
      }
    },
    setMapTypeId: function(){
      return;
    },
    controls: []
  };
} 
if (google === null || google === undefined){
  var google = {
    maps: {
      event: {
        trigger: function () {}
      }
    }
  };
}

if (Object.keys(Marker).length === 0){
  Marker = {
    setMap: function(map){
      return map;
    },
    position: function() {}
  };
}

describe ('Testing print operations', function() {
  beforeEach(function(done) {
    var mapBodyDiv = document.createElement('div');
    $(mapBodyDiv).addClass('map-body');
    $('body').append(mapBodyDiv);

    $('body').append('<div id="sidebar" class="hidden"></div>');
    var dummySidebar = document.createElement('div');
    $('#sidebar').append(dummySidebar);
    $('#sidebar').css('display', 'none');
    var accordion = '<li>' + 
      '<button id="test_button" class="usa-accordion-button" aria-expanded="false" aria-controls="indian_lands">' + 
        'Indian Lands' + 
      '</button>' +
      '<div id="indian_lands" class="usa-accordion-content" aria-hidden="true">' +
        '<p>' +
        '</p><table class="usa-table-borderless hubzone-qualification-details">' +
        '<tbody>' +
          '<tr>' +
            '<th scope="row">Expires</th>' +
            '<td></td>' +
          '</tr>' +
          '</tbody>' +
        '</table' +
        '<p></p>' +
      '</div>' + 
    '</li>';
    $(dummySidebar).append(accordion);
    updateAccordions();
    setTimeout(function() {
      done();
    }, 1);
  });

  afterEach(function(done){
    $('.map-body').remove();
    $('#sidebar').remove();
    setTimeout(function() {
      done();
    }, 1);
  });

  //google and map objects are inherited from map_spec.js
  it ("should update the map div before print with no marker present", function(){
    mapMarkers = [];
    spyOn(map, 'getBounds');
    spyOn(map, 'getCenter');
    spyOn(map, 'getZoom');
    spyOn(map, 'fitBounds');
    spyOn(map, 'setCenter');
    spyOn(google.maps.event, 'trigger');

    beforePrint();

    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.getBounds.calls.count()).toEqual(1);
    expect(map.getCenter.calls.count()).toEqual(1);
    expect(map.getZoom.calls.count()).toEqual(1);
    expect(map.fitBounds.calls.count()).toEqual(1);
    expect(map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');    
    expect($('#test_button').attr('aria-expanded')).toEqual("true");
    expect($('#indian_lands').attr('aria-hidden')).toEqual("false");
  });
  
  it ("should update the map div before print with a marker present", function(){
    mapMarkers = [Marker];
    spyOn(map, 'getBounds');
    spyOn(map, 'getCenter');
    spyOn(map, 'getZoom');
    spyOn(map, 'fitBounds');
    spyOn(map, 'setCenter');
    spyOn(google.maps.event, 'trigger');

    beforePrint();
    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.getBounds.calls.count()).toEqual(1);
    expect(map.getCenter.calls.count()).toEqual(1);
    expect(map.getZoom.calls.count()).toEqual(1);
    expect(map.fitBounds.calls.count()).toEqual(1);
    expect(map.setCenter.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(1);
    expect(mapBodyDivClasses).toContain('print');
    expect($('#test_button').attr('aria-expanded')).toEqual("true");
    expect($('#indian_lands').attr('aria-hidden')).toEqual("false");

  });

  it ("should reset the map view", function(){
    spyOn(map, 'setCenter');
    spyOn(map, 'setZoom');
    spyOn(google.maps.event, 'trigger');

    beforePrint();
    afterPrint();
    var mapBodyDivClasses = $('.map-body').attr('class');

    expect(map.setCenter.calls.count()).toEqual(2);
    expect(map.setZoom.calls.count()).toEqual(1);
    expect(google.maps.event.trigger.calls.count()).toEqual(2);
    expect(mapBodyDivClasses).not.toContain('print');
    expect($('#test_button').attr('aria-expanded')).toEqual("false");
    expect($('#indian_lands').attr('aria-hidden')).toEqual("true");
  });

  it ("should run beforePrint then window.Print", function(){
    spyOn(window, 'beforePrint');
    //basically mocks setTimeout since I couldn't get it to
    // run print 
    spyOn(window, 'setTimeout').and.callFake(function(fn){
      fn.apply(null, arguments);
      return;
    });
    spyOn(window, 'print');

    catchPrintEvent(1);
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
