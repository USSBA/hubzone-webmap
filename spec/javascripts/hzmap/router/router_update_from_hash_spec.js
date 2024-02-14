//= require hzmap/router
//= require hzmap/map-utils
//= require hzmap/hash-utils
//= require hzmap/ga
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Router operations', function() {
  var center, centerValue, zoom, lat, lng;
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
        newHashState = HZApp.HashUtils.parseLocationHash(inputHash);
        Object.keys(hashState).forEach(function(key){
          expect(newHashState[key]).toEqual(hashState[key]);
        });
      });
      it("should be okay with a weird hash", function(){
        inputHash = "foo=bar&bar=baz&this=that";
        newHashState = HZApp.HashUtils.parseLocationHash(inputHash);
        Object.keys(hashState).forEach(function(key){
          expect(newHashState[key]).toEqual(hashState[key]);
        });
      });
      ["foo", "", null, undefined].map(function(state){
        it("should be okay with an empty hash: " + state, function(){
          inputHash = state;
          newHashState = HZApp.HashUtils.parseLocationHash(inputHash);
          expect(newHashState).not.toBe();
        });
      });
    });

    describe("basic map event callbacks", function(){
      beforeEach(function(){
        spyOn(HZApp.Router, 'currentMapLocationToHash');
      });
      it("updateMapCenter should call currentMapLocationToHash", function(){
        HZApp.Router.updateMapCenter();
        expect(HZApp.Router.currentMapLocationToHash.calls.count()).toEqual(1);
      });
      it("updateMapZoom should call currentMapLocationToHash", function(){
        HZApp.Router.updateMapZoom();
        expect(HZApp.Router.currentMapLocationToHash.calls.count()).toEqual(1);
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

      describe("should trigger an address search with a valid string", function(){
        beforeEach(function(){
          spyOn(HZApp.MapUtils, 'sendMapSearch').and.callThrough();
          spyOn(HZApp.GA, 'trackSubmit');
          mockHash = "#q=8%20market%20place";
          HZApp.Router.updateStateFromHash(mockHash);
        });
        it("should call sendMapSearch", function(){
          expect(HZApp.MapUtils.sendMapSearch.calls.count()).toEqual(1);
        });
        it("should call GA trackSubmit", function(){
          expect(HZApp.GA.trackSubmit.calls.count()).toEqual(1);
        });
      });

      describe("should update the map zoom and center if only latlng hash is present", function(){
        beforeEach(function(){
          spyOn(HZApp.Router, 'updateMapCenterAndZoom');
          mockHash = "#latlng=40.188316,-98.046112";
          HZApp.Router.updateStateFromHash(mockHash);
        });
        it("should update center and zoom", function(){
          expect(HZApp.Router.updateMapCenterAndZoom.calls.count()).toEqual(2);
        });
      });

      describe("should update the map zoom if zoom hash is present", function(){
        beforeEach(function(){
          spyOn(HZApp.map, 'setZoom');
          spyOn(HZApp.map, 'setCenter');
          mockHash = "#q=8%20market%20place&zoom=15";
          var hashState = HZApp.HashUtils.parseLocationHash(mockHash);
          HZApp.Router.updateMapCenterAndZoom(hashState);
        });
        it("should call setZoom", function(){
          expect(HZApp.map.setZoom.calls.count()).toEqual(1);
        });
        it("should not call setCenter", function(){
          expect(HZApp.map.setCenter.calls.count()).toEqual(0);
        });
      });

      describe("should update the map center if center hash is present", function(){
        beforeEach(function(){
          spyOn(HZApp.map, 'setZoom');
          spyOn(HZApp.map, 'setCenter');
          mockHash = "#q=8%20market%20place&center=15,-15";
          var hashState = HZApp.HashUtils.parseLocationHash(mockHash);
          HZApp.Router.updateMapCenterAndZoom(hashState);
        });
        it("should not call setZoom", function(){
          expect(HZApp.map.setZoom.calls.count()).toEqual(0);
        });
        it("should call setCenter", function(){
          expect(HZApp.map.setCenter.calls.count()).toEqual(1);
        });
      });

      describe("should update the map center and zoom if both present", function(){
        beforeEach(function(){
          spyOn(HZApp.map, 'setZoom');
          spyOn(HZApp.map, 'setCenter');
          mockHash = "#q=8%20market%20place&center=15,-15&zoom=8";
          var hashState = HZApp.HashUtils.parseLocationHash(mockHash);
          HZApp.Router.updateMapCenterAndZoom(hashState);
        });
        it("should call setZoom", function(){
          expect(HZApp.map.setZoom.calls.count()).toEqual(1);
        });
        it("should call setCenter", function(){
          expect(HZApp.map.setCenter.calls.count()).toEqual(1);
        });
      });
    });
  });
});
