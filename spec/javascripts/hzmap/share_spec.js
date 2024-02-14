//= require hzmap/router
//= require hzmap/share
//= require hzmap/map-utils
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

  describe("copying URL to clipboard", function(){
    beforeEach(function(){
      location.hash = "center=62.46070,-114.35251&zoom=9";
    });

    it("should copy the URL to the clipboard", function(){
      spyOn(window.document, 'execCommand');
      HZApp.ShareMap.showShareUrl();
      HZApp.ShareMap.copyUrl();
      expect(window.document.execCommand.calls.count()).toEqual(1);
      expect(window.document.execCommand.calls.allArgs()[0][0]).toEqual('copy');
    });
  });
});
