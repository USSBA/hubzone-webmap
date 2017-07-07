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
