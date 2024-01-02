//= require hzmap
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing autocomplete operations', function() {
  beforeEach(function(){
    google = HZSpecHelper.google;
    HZSpecHelper.mockPage.build();
    HZApp.map = new google.maps.Map();
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
    spyOn(HZApp.Autocomplete, 'triggerSearch');
    autocompleteMock = new google.maps.places.Autocomplete('', '');
    spyOn(autocompleteMock, 'addListener');

    HZApp.Autocomplete.createListener(autocompleteMock);

    expect(HZApp.Autocomplete.triggerSearch.calls.count()).toEqual(1);
    expect(autocompleteMock.addListener.calls.count()).toEqual(1);

  });

  it("should trigger a search when place is clicked or entered", function() {
    $('body').append('<div id="test" class="test"></div>');
    var testDiv = $('.test');
    spyOn(testDiv, 'submit');

    var triggerCallback = HZApp.Autocomplete.triggerSearch(testDiv);
    triggerCallback();

    expect(testDiv.submit.calls.count()).toEqual(1);
    $('#test').remove();
  });

});
