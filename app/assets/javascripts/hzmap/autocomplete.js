// autocomplete contrustructor
HZApp.Autocomplete = {
  searchInput: function(){
  	return document.getElementById('search-field-small');
  },
  options: {
    types: []
  }, 
  createAutocomplete: function(){
  	return new google.maps.places.Autocomplete(this.searchInput(), this.options);
  }
};
