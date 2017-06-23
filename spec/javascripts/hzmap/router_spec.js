//= require hzmap/router
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Router operations', function() {
  beforeEach(function(){
    fixture.cleanup();
    this.fixtures = fixture.load("main_fixture.html", true);
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
  });

  afterEach(function(){
    google = {};
    HZApp.map = {};
  });

  describe("adding app data to the URL hash", function(){
    it("should add map center to the hash", function(){

    });
  });
});
