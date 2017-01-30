// autocomplete contrustructor
HZApp.Autocomplete = (function(){
  return {
    searchInput: function(){
      return document.getElementById('search-field-small');
    },
    options: {
      types: []
    }, 
    autocomplete: {},
    createAutocomplete: function(){
      this.autocomplete = new google.maps.places.Autocomplete(this.searchInput(), this.options);
    }
  };
})();
