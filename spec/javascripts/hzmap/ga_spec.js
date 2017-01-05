//= require hzmap
//= require ../helpers/sinon-1.17.6
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Google Analytics integration', function() {

  beforeEach(function(done) {
  /* global window:true */
  window = window || {}; //what was this for?  JS Hint doesn't like it
    window.ga = window.ga || function(a,b,c,d){};
    spyOn(window, 'ga');
    done();
  });

  describe ('with clicking locations on the map', function() {
    it('should send an event when a user clicks on the map', function() {
      clickEvent = { 'latLng': { 'lat': function() { return 39.28885; },
                            'lng': function() { return -76.6070; } } };
      catchMapClick(clickEvent);
      expect(window.ga.calls.count()).toEqual(1);
    });
  });

  describe ('with the Sidebar', function() {
    beforeEach(function(done) {
      var sidebar = mockPage.build();
      setTimeout(function() {
        done();
      }, 1);
    });

    afterEach(function(done) {
      mockPage.destroy();
      setTimeout(function() {
        done();
      }, 1);
    });
    
    it('should send an event when a user toggles the sidebar', function() {
      //fails sporadically http://localhost:3000/specs?random=true&seed=51235

      // open the sidebar...
      triggerSidebar();
      expect(sidebar.currentClass).toEqual('on');
      expect(window.ga.calls.count()).toEqual(1);
      // ... and close the sidebar.
      triggerSidebar();
      expect(sidebar.currentClass).toEqual('hidden');
      expect(window.ga.calls.count()).toEqual(2);
    });

    it('should send an event when a qualification is toggled', function() {
      //fails sporadically where ga.call.count = 2 and not 1
      $('button.usa-accordion-button').trigger('click');

      expect(window.ga.calls.count()).toEqual(1);
    });
  });

});
