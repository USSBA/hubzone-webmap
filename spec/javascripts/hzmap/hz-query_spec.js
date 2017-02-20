//= require hzmap/hz-query
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing hz-query functions', function() {
  beforeEach(function(){
    google = HZSpecHelper.google;
    HZSpecHelper.mockPage.build();
    HZApp.map = new google.maps.Map();
    $('#sidebar').css('display', 'initial');
  });

  afterEach(function(){
    HZApp.map = {};
    HZSpecHelper.mockPage.destroy();
  });

  //pass over the different search responses
  HZSpecHelper.searchResponses.map(function(response){
    describe ('should handle a ' + response.mockResponseType, function(){

      it ('should correctly parse the response object', function(){
        spyOn(HZApp.HZQuery, 'handleBadResponses');
        spyOn(HZApp.HZQuery, 'parseResponseGeometry');
        spyOn(HZApp.HZQuery, 'updateMap');

        HZApp.HZQuery.parseResponse(response);
        expect(HZApp.HZQuery.handleBadResponses.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.parseResponseGeometry.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.updateMap.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.response).toEqual(response);
      });

      var sidebarVisibilty = (response.mockResponseType === 'good response');

      it ('the report button/card should be ' + (sidebarVisibilty ? ' visible' : ' not visible'), function(){
        HZApp.HZQuery.handleBadResponses(response.status);

        expect(HZApp.HZQuery.query.latlng).toEqual(null);
        expect(HZApp.HZQuery.query.q).toEqual(null);
        expect($('.sidebar-card.map-report').is(':visible')).toBe(sidebarVisibilty);
      });


    });
  });  

});
