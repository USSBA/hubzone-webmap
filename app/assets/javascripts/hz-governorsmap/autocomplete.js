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
  createListener: function(autocompleteObject){
    //autocompleteObject.addListener('place_changed', this.triggerSearch($('.usa-search')) );
     // Add listener to the autocomplete object
     console.log('autocomplete');
     autocompleteObject.addListener('place_changed', function () {
      var place = autocompleteObject.getPlace();
      if (!place.geometry) {
          console.log("Autocomplete's returned place contains no geometry");
          return;
      }

      // Find the state component from the address components
      var stateComponent = place.address_components.find(function (component) {
          return component.types.includes('administrative_area_level_1');
      });

      if (stateComponent) {
          var stateName = stateComponent.long_name;
          var stateSelect = document.getElementById("mapHighlightState");

          for (var i = 0; i < stateSelect.options.length; i++) {
              if (stateSelect.options[i].text.toLowerCase() === stateName.toLowerCase()) {
                  stateSelect.selectedIndex = i;
                  break;
              }
          }

          // Trigger the apply filter button click event
          let searchValue =  document.getElementById('search-field-small').value;
          $('#mapHighlightState').change();
          $('.usa-search').submit();
          document.getElementById('search-field-small').value = searchValue;
      } else {
          alert("Please select a valid state from the suggestions.");
      }
  });

  },
  triggerSearch: function($selector) {
    return function() {
      $selector.submit();
    };
  }
};
