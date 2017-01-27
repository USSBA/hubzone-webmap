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
  	this.autocomplete = new google.maps.places.Autocomplete(this.searchInput(), this.options);
  },
  createListener: function(){
    HZApp.Autocomplete.autocomplete.addListener('place_changed', function() {
      $('.usa-search').submit();
    });
  }
};
