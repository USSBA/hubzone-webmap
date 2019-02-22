//= require hzmap/ga
//= require hzmap/sidebar
//= require hzmap/map-utils
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Google Analytics integration', function() {

  beforeEach(function(done) {
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
  /* global window:true */
  window = window || {}; //what was this for?  JS Hint doesn't like it
    window.ga = window.ga || function(a,b,c,d){};
    spyOn(window, 'ga');
    done();
  });

  describe ('with clicking locations on the map', function() {
    describe('should send an event when a user clicks on the map', function() {
      beforeEach(function() {
        clickEvent = { 'latLng': { 'lat': function() { return 39.28885; },
                                   'lng': function() { return -76.6070; } } };
        HZApp.MapUtils.catchMapClick(clickEvent);
      });
      it('should call google analytics', function() {
        expect(window.ga.calls.count()).toEqual(1);
      });
    });
  });

  describe ('with the Sidebar', function() {
    beforeEach(function() {
      HZSpecHelper.mockPage.build();
      HZApp.SidebarUtils.buildSidebar();
      sidebar = HZApp.SidebarUtils.sidebar;
    });

    afterEach(function() {
      HZApp.SidebarUtils.sidebar = {};
      sidebar = {};
      HZSpecHelper.mockPage.destroy();
    });

    it('should send an event when a user toggles the sidebar', function() {
      //fails sporadically http://localhost:3000/specs?random=true&seed=51235
      // open the sidebar...
      sidebar.close();
      HZApp.SidebarUtils.triggerSidebar();
      expect(sidebar.hasClass('on')).toBe(true);
      expect(window.ga.calls.count()).toEqual(1);
      // ... and close the sidebar.
      sidebar.open();
      HZApp.SidebarUtils.triggerSidebar();
      expect(sidebar.hasClass('closed')).toEqual(true);
      expect(window.ga.calls.count()).toEqual(2);
    });
  });

  describe ("handling different functions", function(){
    it('should send an event when links are clicked', function() {
      spyOn(HZApp.GA, 'navigateToPage');
      spyOn(window, 'setTimeout').and.callFake(function(fn){
        fn.apply(null, arguments);
        return;
      });
      HZApp.GA.openLink( 'https://sba.gov', 'map', 'logo-link' );
      expect(HZApp.GA.navigateToPage.calls.count()).toEqual(1);
      expect(window.setTimeout.calls.count()).toEqual(1);
    });

    it('should send links even when ga is not present', function() {
      spyOn(HZApp.GA, 'navigateToPage');
      window.ga = {};
      HZApp.GA.openLink( 'https://sba.gov', 'map', 'logo-link' );
      expect(HZApp.GA.navigateToPage.calls.count()).toEqual(1);
    });

    it('should return the document.location function', function() {
      returnVal = HZApp.GA.navigateToPage;
      expect(typeof(returnVal)).toEqual('function');
    });

    it('should track submitting form', function(){
      spyOn(HZApp.GA, 'track');
      HZApp.GA.trackSubmit('click','#search-field-small');
      callArgs = HZApp.GA.track.calls.allArgs();
      expect(HZApp.GA.track.calls.count()).toEqual(1);
      expect(callArgs[0][0]).toEqual('map');
      expect(callArgs[0][1]).toEqual('click');
    });
  });
});
