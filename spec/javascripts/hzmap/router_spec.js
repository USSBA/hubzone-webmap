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

  describe("adding app data to the URL hash", function(){

    describe("should handle window events", function(){
      describe("should handle page loads", function(){
        it("should not update the state of the app if the hash is empty on page load", function(){
          spyOn(HZApp.Router, 'updateStateFromHash');
          location.hash = "";
          HZApp.Router.catchPageLoad();
          expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(0);
        });
        it("should try to update the state of the app if the hash is empty on page load", function(){
          spyOn(HZApp.Router, 'updateStateFromHash');
          location.hash = "#foo=bar";
          HZApp.Router.catchPageLoad();
          expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(1);
        });
      });
    });

    describe("should update hash based on different data states: updating map center", function(){

      it("should add map center to the hash when hash is empty", function(){
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue, location.hash);
        expect(updatedHash).toEqual("center=" + centerValue);
      });

      it("should add map center when hash is not empty but doesnt have center", function(){
        location.hash = "foo=bar";
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue, location.hash);
        expect(updatedHash).toEqual(location.hash + "&center=" + centerValue);
      });

      it("should update map center when center is present in middle of hash", function(){
        location.hash = "foo=bar&center=39,-76&zoom=" + zoom;
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue, location.hash);
        expect(updatedHash).toEqual("#foo=bar&center=" + centerValue + "&zoom=" + zoom);
      });

      it("should update map center when center is present at end of hash", function(){
        location.hash = "foo=bar&zoom=" + zoom + "&center=39,-76";
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue, location.hash);
        expect(updatedHash).toEqual("#foo=bar&zoom=" + zoom + "&center=" + centerValue);
      });
    });

    describe("setting the hash", function(){

      it("should set the hash", function(){
        HZApp.Router.setSingleHash("center", centerValue);
        expect(location.hash).toEqual("#center=" + centerValue);
      });

      it("should handle updates to the hash as well", function(){
        location.hash = "zoom=" + zoom + "&center=0,0";
        HZApp.Router.setSingleHash("center", centerValue);
        expect(location.hash).toEqual("#zoom=" + zoom + "&center=" + centerValue);
      });
    });

    describe("updating the map center and zoom", function(){
      it("should set map center and zoom when empty", function(){
        HZApp.Router.setCenterAndZoomHash(center, zoom);
        expect(location.hash).toEqual('#center=' + centerValue + "&zoom=" + zoom);
      });

      it("should update an exisiting center and zoom hash", function(){
        location.hash = "center=62.46070,-114.35251&zoom=9";
        HZApp.Router.setCenterAndZoomHash(center, zoom);
        expect(location.hash).toEqual('#center=' + centerValue + "&zoom=" + zoom);
      });
    });

    describe("should supporting clearing the hash", function(){
      it("should entirely empty the hash", function(){
        HZApp.Router.setSingleHash("center", centerValue);
        HZApp.Router.clearHash();
        expect(location.hash).toEqual("");
      });
      it("should clear a single parameter at the front of the hash", function(){
        HZApp.Router.setSingleHash("center", centerValue);
        HZApp.Router.setSingleHash("foo", "bar");
        HZApp.Router.clearHash("center");
        expect(location.hash).toEqual("#foo=bar");
      });
      it("should clear a single parameter at the middle of the hash", function(){
        HZApp.Router.setSingleHash("foo", "bar");
        HZApp.Router.setSingleHash("center", centerValue);
        HZApp.Router.setSingleHash("bee", "boop");
        HZApp.Router.clearHash("center");
        expect(location.hash).toEqual("#foo=bar&bee=boop");
      });
      it("should clear a single parameter at the end of the hash", function(){
        HZApp.Router.setSingleHash("foo", "bar");
        HZApp.Router.setSingleHash("bee", "boop");
        HZApp.Router.setSingleHash("center", centerValue);
        HZApp.Router.clearHash("center");
        expect(location.hash).toEqual("#foo=bar&bee=boop");
      });
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

      describe("should unpack the hash to the get the initial map state", function(){
        var mockHash, newLocation, initialMapLocation;
        beforeEach(function(){
          initialMapLocation = {
            center: {
              lat: 39.8282,
              lng: -98.5795
            },
            zoom: 5
          };
        });
        afterEach(function(){
          initialMapLocation = {
            center: {
              lat: 39.8282,
              lng: -98.5795
            },
            zoom: 5
          };
        });
        it("should not geolocate if hash contains a q address", function(){
          mockHash = "#q=8+market-place";
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(initialMapLocation.center.lat);
          expect(newLocation.center.lng).toEqual(initialMapLocation.center.lng);
          expect(newLocation.zoom).toEqual(initialMapLocation.zoom);
        });
        it("should use the defaults with no hash", function(){
          mockHash = "";
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(initialMapLocation.center.lat);
          expect(newLocation.center.lng).toEqual(initialMapLocation.center.lng);
          expect(newLocation.zoom).toEqual(initialMapLocation.zoom);
        });
        it("should use center and zoom when present", function(){
          mockHash = "#center=" + centerValue + "&zoom=" + zoom;
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(parseFloat(lat));
          expect(newLocation.center.lng).toEqual(parseFloat(lng));
          expect(newLocation.zoom).toEqual(zoom);
        });
        it("should use zoom when present", function(){
          mockHash = "#zoom=" + zoom;
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(initialMapLocation.center.lat);
          expect(newLocation.center.lng).toEqual(initialMapLocation.center.lng);
          expect(newLocation.zoom).toEqual(zoom);
        });
        it("should use center when present", function(){
          mockHash = "#center=" + centerValue;
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(parseFloat(lat));
          expect(newLocation.center.lng).toEqual(parseFloat(lng));
          expect(newLocation.zoom).toEqual(initialMapLocation.zoom);
        });
        it("should ignore garbage", function(){
          mockHash = "#center=foo&zoom=bar";
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(initialMapLocation.center.lat);
          expect(newLocation.center.lng).toEqual(initialMapLocation.center.lng);
          expect(newLocation.zoom).toEqual(initialMapLocation.zoom);
        });
        it("should ignore out of range numbers", function(){
          mockHash = "#center=-100,-200&zoom=22";
          newLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, mockHash);
          expect(newLocation.center.lat).toEqual(initialMapLocation.center.lat);
          expect(newLocation.center.lng).toEqual(initialMapLocation.center.lng);
          expect(newLocation.zoom).toEqual(initialMapLocation.zoom);
        });
      });
    });
  });
});
