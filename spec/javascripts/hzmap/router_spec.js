//= require hzmap/router
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Router operations', function() {
  beforeEach(function(){
    location.hash = "";
    fixture.cleanup();
    this.fixtures = fixture.load("main_fixture.html", true);
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
  });

  afterEach(function(){
    google = {};
    HZApp.map = {};
    location.hash = "";
  });

  describe("adding app data to the URL hash", function(){

    describe("updating map center", function(){
      var center, centerValue;
      beforeEach(function(){
        center = HZApp.map.getCenter();
        centerValue = center.lat() + "," + center.lng();
      });

      it("should add map center to the hash when hash is empty", function(){
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue);
        expect(updatedHash).toEqual("center=" + centerValue);
      });

      it("should add map center when hash is not empty but doesnt have center", function(){
        location.hash = "foo=bar";
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue);
        expect(updatedHash).toEqual(location.hash + "&center=" + centerValue);
      });

      it("should update map center when center is present in middle of hash", function(){
        location.hash = "foo=bar&center=39,-76&zoom=15";
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue);
        expect(updatedHash).toEqual("#foo=bar&center=" + centerValue + "&zoom=15");
      });

      it("should update map center when center is present at end of hash", function(){
        location.hash = "foo=bar&zoom=15&center=39,-76";
        var updatedHash = HZApp.Router.updateHashValue("center", centerValue);
        expect(updatedHash).toEqual("#foo=bar&zoom=15&center=" + centerValue);
      });
    });

    describe("setting the hash", function(){
      var center, centerValue;
      beforeEach(function(){
        center = HZApp.map.getCenter();
        centerValue = center.lat() + "," + center.lng();
      });

      it("should set the hash", function(){
        HZApp.Router.setHash("center", centerValue);
        expect(location.hash).toEqual("#center=" + centerValue);
      });

      it("should handle updates to the hash as well", function(){
        location.hash = "zoom=15&center=0,0";
        HZApp.Router.setHash("center", centerValue);
        expect(location.hash).toEqual("#zoom=15&center=" + centerValue);
      });
    });

    describe("updating the map center and zoom", function(){
      var center, centerValue, zoom;
      beforeEach(function(){
        center = HZApp.map.getCenter();
        centerValue = center.lat() + "," + center.lng();
        zoom = 7;
      });

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
  });
});
