//= require hzmap/router
//= require hzmap/map-utils
//= require hzmap/ga
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Router operations', function() {
  var center, centerValue, zoom;
  beforeEach(function(){
    location.hash = "";
    fixture.cleanup();
    this.fixtures = fixture.load("main_fixture.html", true);
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
    center = HZApp.map.getCenter();
    lat = center.lat().toFixed(6);
    lng = center.lng().toFixed(6);
    centerValue = lat + "," + lng;
    zoom = 7;
  });

  afterEach(function(){
    google = {};
    HZApp.map = {};
    location.hash = "";
  });

  describe("updating app state from the hash", function(){
    describe("should parse the hash string into an object", function(){
      var inputHash, newHashState;
      var hashState = {
        foo: 'bar',
        bar: 'baz',
        this: 'that'
      };
      it("should correctly parse a normal hash", function(){
        inputHash = "#foo=bar&bar=baz&this=that";
        newHashState = HZApp.Router.unpackHash(inputHash);
        Object.keys(hashState).forEach(function(key){
          expect(newHashState[key]).toBeDefined();
          expect(newHashState[key]).toEqual(hashState[key]);
        });
      });
      it("should be okay with a weird hash", function(){
        inputHash = "foo=bar&bar=baz&this=that";
        newHashState = HZApp.Router.unpackHash(inputHash);
        Object.keys(hashState).forEach(function(key){
          expect(newHashState[key]).toBeDefined();
          expect(newHashState[key]).toEqual(hashState[key]);
        });
      });
      ["foo", "", null, undefined].map(function(state){
        it("should be okay with an empty hash: " + state, function(){
          inputHash = state;
          newHashState = HZApp.Router.unpackHash(inputHash);
          expect(newHashState).not.toBe();
        });
      });
    });

    describe("should trigger the correct trigger depending on hash data", function(){
      var mockHash;
      it("should trigger a map click event with a good latlng hash", function(){
        spyOn(HZApp.MapUtils, 'sendMapClick');
        mockHash = "#center=62.46070,-114.35251&zoom=9&latlng=40.188316,-98.046112";
        HZApp.Router.updateStateFromHash(mockHash);
        expect(HZApp.MapUtils.sendMapClick.calls.count()).toEqual(1);
      });

      it("should NOT trigger a map click event with a bad latlng hash", function(){
        spyOn(HZApp.MapUtils, 'sendMapClick');
        mockHash = "#center=62.46070,-114.35251&zoom=9&latlng=blah,blah";
        HZApp.Router.updateStateFromHash(mockHash);
        expect(HZApp.MapUtils.sendMapClick.calls.count()).toEqual(0);
      });
      it("should NOT trigger a map click event with no latlng hash", function(){
        spyOn(HZApp.MapUtils, 'sendMapClick');
        mockHash = "#center=62.46070,-114.35251&zoom=9";
        HZApp.Router.updateStateFromHash(mockHash);
        expect(HZApp.MapUtils.sendMapClick.calls.count()).toEqual(0);
      });
      it("should trigger an address search with a valid string", function(){
        spyOn(HZApp.MapUtils, 'sendMapSearch').and.callThrough();
        spyOn(HZApp.GA, 'trackSubmit');
        mockHash = "#q=8%20market%20place";
        HZApp.Router.updateStateFromHash(mockHash);
        expect(HZApp.MapUtils.sendMapSearch.calls.count()).toEqual(1);
        expect(HZApp.GA.trackSubmit.calls.count()).toEqual(1);
      });
      it("should update the map zoom if zoom hash is present", function(){
        spyOn(HZApp.map, 'setZoom');
        spyOn(HZApp.map, 'setCenter');
        mockHash = "#q=8%20market%20place&zoom=15";
        var hashState = HZApp.Router.unpackHash(mockHash);
        HZApp.Router.updateMapCenterAndZoom(hashState);
        expect(HZApp.map.setZoom.calls.count()).toEqual(1);
        expect(HZApp.map.setCenter.calls.count()).toEqual(0);
      });
      it("should update the map center if center hash is present", function(){
        spyOn(HZApp.map, 'setZoom');
        spyOn(HZApp.map, 'setCenter');
        mockHash = "#q=8%20market%20place&center=15,-15";
        var hashState = HZApp.Router.unpackHash(mockHash);
        HZApp.Router.updateMapCenterAndZoom(hashState);
        expect(HZApp.map.setZoom.calls.count()).toEqual(0);
        expect(HZApp.map.setCenter.calls.count()).toEqual(1);
      });
      it("should update the map center and zoom if both  present", function(){
        spyOn(HZApp.map, 'setZoom');
        spyOn(HZApp.map, 'setCenter');
        mockHash = "#q=8%20market%20place&center=15,-15&zoom=8";
        var hashState = HZApp.Router.unpackHash(mockHash);
        HZApp.Router.updateMapCenterAndZoom(hashState);
        expect(HZApp.map.setZoom.calls.count()).toEqual(1);
        expect(HZApp.map.setCenter.calls.count()).toEqual(1);
      });
    });

    describe("catchHashChange", function(){

    });
  });
});
