// Basic hash router module
HZApp.Router = (function(){

  // Listen on page load:
  // window.addEventListener('load', function(){
  //   HZApp.Router.updateStateFromHash(location.hash);
  // });

  return {

    // allows for ignoring hashchange event callback
    silentHashChange: false,


    // main task that updates the hash,
    setHash: function(hashParam, hashValue){
      location.hash = this.updateHashValue(hashParam, hashValue);
    },

    // helper to get just the google map center and zoom and update the hash from that
    setCenterAndZoomHash: function(mapCenter, zoom){
      this.setHash('center', mapCenter.lat().toFixed(6) + ',' + mapCenter.lng().toFixed(6));
      this.setHash('zoom', zoom);
    },

    // clear the hash completly, or clear a parameter
    clearHash: function(hashParam){
      hashParam = hashParam || null;
      if (hashParam){
        var hashRegexInside = this.getHashRegexInside(hashParam);
        var hashRegexOutside = this.getHashRegexOutside("&" + hashParam);

        if (location.hash.match(hashRegexInside) !== null) {
          location.hash = location.hash.replace(hashRegexInside, "");
        } else if (location.hash.match(hashRegexOutside) !== null) {
          location.hash = location.hash.replace(hashRegexOutside, "");
        }
      } else {
        location.hash = "";
      }
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue){
      var newHash = encodeURI(hashParam + "=" + hashValue);
      var updatedHash = "";
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside(hashParam);

      if (location.hash === "") {
        updatedHash = newHash;
      } else if (location.hash.match(hashParamRegex) === null) {
        updatedHash = location.hash + "&" + newHash;
      } else if (location.hash.match(hashRegexInside) !== null) {
        updatedHash = location.hash.replace(hashRegexInside, newHash + "&");
      } else if (location.hash.match(hashRegexOutside) !== null) {
        updatedHash = location.hash.replace(hashRegexOutside, newHash);
      }
      return updatedHash;
    },

    //if the hash is between # and &
    getHashRegexInside: function(hashParam){
      return new RegExp(hashParam + "=" + '.+?\&', "ig");
    },

    // if the hash is between (# and end of line) or (& and end of line)
    getHashRegexOutside: function(hashParam){
      return new RegExp(hashParam + "=" + '.*$', "ig");
    },

    // define the actions for different hash params
    // hashControllers: {
    //   latlng: function(latlng){
    //     console.log(latlng);
    //   },
    //   q: function(q){
    //     console.log(q);
    //   },
    // },

    // // update the app state from the hash
    // updateStateFromHash: function(hash){
    //   console.log('current hash: ', hash);
    //   if (hash !== ""){
    //     var hashState = this.unpackHash(hash);
    //     Object.keys(this.hashControllers).forEach(function(controller){
    //       if (hashState[controller]){
    //         HZApp.Router.hashControllers[controller](hashState[controller]);
    //       }
    //     });
    //   }
    // },

    // unpack the hash parameters and values
    unpackHash: function(hash){
      var hashState = {};
      if (hash === null || hash === undefined){
        return null;
      } else {
        var hashSplit = hash[0] === '#' ? hash.slice(1).split("&") : hash.split("&");
        if (hashSplit.length > 0 && hashSplit !== hash){
          hashSplit.map(function(hash){
            var h_split = hash.split('=');
            hashState[h_split[0]] = h_split[1];
          });
          return hashState;
        } else {
          return null;
        }
      }
    },

    unpackInitialMapLocation: function(mapLocation, hash){
      if (hash !== ""){
        var hashState = HZApp.Router.unpackHash(hash);
        //parse new map center, guarding for illegal values
        mapLocation.center = this.unpackValidCenter(hashState.center) || mapLocation.center;
        //parse new map zoom, guarding for illegal values
        mapLocation.zoom = this.unpackValidZoom(hashState.zoom) || mapLocation.zoom;
      }
      return mapLocation;
    },

    unpackValidCenter: function(center){
      if (typeof(center) === 'string'){
        var centerLatLng = center.split(',');
        var lat = parseFloat(centerLatLng[0]);
        var lng = parseFloat(centerLatLng[1]);
        if ( (lat >= -90 && lat <= 90) && (lng >= -180 && lng <= 180 ) ){
          return {lat: lat, lng: lng};
        }
      }
    },

    unpackValidZoom: function(zoom){
      zoom = parseInt(zoom);
      if (zoom >= 0 && zoom <= 20){
        return zoom;
      }
    },

  };
})();
