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

  describe("should perform the correct actions for window event callbacks", function(){
    describe("catchPageLoad", function(){
      beforeEach(function(){
        spyOn(HZApp.Router, 'updateStateFromHash');
        spyOn(google.maps.event, 'addListener');
      });
      it("should bind the map event listeners", function(){
        HZApp.Router.catchPageLoad();
        expect(google.maps.event.addListener.calls.count()).toEqual(2);
      });
      it("should not call updateStateFromHash if the location.hash is empty", function(){
        location.hash = "";
        HZApp.Router.catchPageLoad();
        expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(0);
      });
      it("should call updateStateFromHash if the location.hash is not empty", function(){
        location.hash = "#center=" + centerValue + "&zoom=" + zoom;
        HZApp.Router.catchPageLoad();
        expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(1);
      });

    });
    describe("catchHashChange", function(){
      beforeEach(function(){
        spyOn(HZApp.Router, 'updateStateFromHash');
      });
      describe("on silent hash change", function(){
        beforeEach(function(){
          HZApp.Router.silentHashChange.setSilent(true, 'teaspoon');
          HZApp.Router.catchHashChange();
        });
        it("should not call update", function(){
          expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(0);
        });
        it("should reset silent hash", function(){
          expect(HZApp.Router.silentHashChange.silent);
        });
      });
      describe("on non-silent hash change", function(){
        beforeEach(function(){
          HZApp.Router.silentHashChange.setSilent(false, 'teaspoon');
          HZApp.Router.catchHashChange();
        });
        it("should not call update", function(){
          expect(HZApp.Router.updateStateFromHash.calls.count()).toEqual(1);
        });
        it("should reset silent hash", function(){
          expect(!HZApp.Router.silentHashChange.silent);
        });
      });
    });

  });
});
