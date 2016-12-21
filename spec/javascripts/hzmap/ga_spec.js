//= require hzmap
//= require ../helpers/sinon-1.17.6
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Google Analytics integration', function() {
  beforeEach(function(done) {
//   window = window || {}; //what was this for?  JS Hint doesn't like it
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
      $('body').append('<div id="sidebar" class="hidden"></div>');
      sidebar = $('#sidebar').sidebar();
      var testDiv = document.createElement('div');
      $('#sidebar').append(testDiv);
      $('#sidebar').css('display', 'none');
      var accordion = '<li>' + 
        '<button id="test_button" class="usa-accordion-button" aria-expanded="false" aria-controls="indian_lands">' + 
          'Indian Lands' + 
        '</button>' +
        '<div id="indian_lands" class="usa-accordion-content" aria-hidden="true">' +
          '<p>' +
          '</p><table class="usa-table-borderless hubzone-qualification-details">' +
          '<tbody>' +
            '<tr>' +
              '<th scope="row">Expires</th>' +
              '<td></td>' +
            '</tr>' +
            '</tbody>' +
          '</table' +
          '<p></p>' +
        '</div>' + 
      '</li>';
      $(testDiv).append(accordion);
      updateAccordions();
      setTimeout(function() {
        done();
      }, 1);
    });

    afterEach(function(done) {
      $('#sidebar').remove();
      setTimeout(function() {
        done();
      }, 1);
    });
    
    it('should send an event when a user toggles the sidebar', function() {
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

      $('button.usa-accordion-button').trigger('click');

      expect(window.ga.calls.count()).toEqual(1);
    });
  });

});
