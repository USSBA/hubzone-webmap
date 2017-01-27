//= require hzmap
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing autocomplete operations', function() {
  beforeEach(function(){
    google = HZSpecHelper.google;
    HZSpecHelper.mockPage.build();
  });

  afterEach(function(){
    HZApp.map = {};
    HZSpecHelper.mockPage.destroy();
  });

  it("should create a google Autocomplete at the search-field-small", function(){
    spyOn(google.maps.places, 'Autocomplete');
    spyOn(HZApp.Autocomplete, 'searchInput').and.callThrough();
    spyOn(document, 'getElementById');

    HZApp.Autocomplete.createAutocomplete();
    expect(document.getElementById.calls.count()).toEqual(1);
    expect(document.getElementById.calls.allArgs()[0][0]).toEqual('search-field-small');
  });

  it("should add a listener for when a place is selected", function() {
    spyOn(HZApp.Autocomplete, 'addListener');
    HZApp.Autocomplete.createListener();
    expect(HZApp.Autocomplete.autocomplete.addListener.calls.count()).toEqual(1)
  });

});
