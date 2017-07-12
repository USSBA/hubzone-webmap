// autocomplete contrustructor
HZApp.Autocomplete = {
  searchInput: function(){
    return document.getElementById('search-field-small');
  },
  options: {
    types: []
  },
  autocomplete: {},
  createAutocomplete: function(){
    console.log(google)
    this.autocomplete = new google.maps.places.Autocomplete(this.searchInput(), this.options);
  },
  createListener: function(autocompleteObject){
    autocompleteObject.addListener('place_changed', this.triggerSearch($('.usa-search')) );
  },
  triggerSearch: function($selector) {
    return function() {
      $selector.submit();
    };
  }
};
