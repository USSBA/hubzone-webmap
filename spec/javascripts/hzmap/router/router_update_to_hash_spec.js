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
      // describe("should handle page loads", function(){
      //   it("should not update the state of the app if the hash is empty on page load", function(){
      //     spyOn(HZApp.Router, 'updateStateFromHash');
      //     location.hash = "";
      //     HZApp.Router.catchPageLoad();
      //     expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(0);
      //   });
      //   it("should try to update the state of the app if the hash is empty on page load", function(){
      //     spyOn(HZApp.Router, 'updateStateFromHash');
      //     location.hash = "#foo=bar";
      //     HZApp.Router.catchPageLoad();
      //     expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(1);
      //   });
      // });
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
  });
});
