// Basic hash router module
HZApp.Router = (function(){

  // still need to listen on page load to check for latlng values
  window.addEventListener('load', function(){
    if (!HZApp.Router.emptyHash(location.hash)){
      HZApp.Router.updateStateFromHash(location.hash);
    }
  });

  return {
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
        location.hash = this.findAndRemoveHashParam(hashParam);
      } else {
        location.hash = "";
      }
    },

    findAndRemoveHashParam: function(hashParam){
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside("&" + hashParam);

      var updatedHash;
      if (location.hash.match(hashRegexInside) !== null) {
        updatedHash = location.hash.replace(hashRegexInside, "");
      } else if (location.hash.match(hashRegexOutside) !== null) {
        updatedHash = location.hash.replace(hashRegexOutside, "");
      } else {
        updatedHash = location.hash;
      }
      return updatedHash;
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue){
      var newHash = encodeURI(hashParam + "=" + hashValue);
      var updatedHash = "";
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside(hashParam);

      if (this.emptyHash(location.hash)) {
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
    hashControllers: {
      latlng: function(latlng_s){
        var latlng = HZApp.Router.unpackValidLatLng(latlng_s) || null;
        if (latlng){ HZApp.MapUtils.sendMapClick(latlng); }
      },
      q: function(q){
        console.log('q:', q);
      },
    },

    // update the app state from the hash
    updateStateFromHash: function(hash){
      if (!this.emptyHash(hash)){
        var hashState = this.unpackHash(hash);
        Object.keys(this.hashControllers).forEach(function(controller){
          if (hashState[controller]){
            HZApp.Router.hashControllers[controller](hashState[controller]);
          }
        });
      }
    },

    // unpack the hash parameters and values
    unpackHash: function(hash){
      if (this.emptyHash(hash)){
        return null;
      } else {
        return this.parseLocationHash(hash);
      }
    },

    // parse the location hash string into an object with key, value pairs
    parseLocationHash: function(hash){
      var hashState = {};
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
    },

    // update the mapLocation object based on checking the contents of the hash
    unpackInitialMapLocation: function(mapLocation, hash){
      if (!this.emptyHash(hash)){
        return this.checkValidHashParams(mapLocation, HZApp.Router.unpackHash(hash));
      } else {
        return mapLocation;
      }
    },

    //parse new map center, guarding for illegal values
    //parse new map zoom, guarding for illegal values
    // update useGeoLocation based on whether valid hash params were found
    checkValidHashParams: function(mapLocation, hashState){
      var validCenter, validZoom;
      validCenter = this.unpackValidLatLng(hashState.center);
      validZoom = this.unpackValidZoom(hashState.zoom);
      if (validCenter) { mapLocation.center = validCenter; }
      if (validZoom) { mapLocation.zoom = validZoom; }
      if (validZoom || validCenter) { mapLocation.useGeoLocation = false; }
      return mapLocation;
    },

    // lat lng pairs should be within within the valid range
    unpackValidLatLng: function(latlng){
      if (typeof(latlng) === 'string'){
        var latLngArr = latlng.split(',');
        var lat = parseFloat(latLngArr[0]);
        var lng = parseFloat(latLngArr[1]);
        if ( (lat >= -90 && lat <= 90) && (lng >= -180 && lng <= 180 ) ){
          return {lat: lat, lng: lng};
        }
      }
    },

    // zoom should be within valid range
    unpackValidZoom: function(zoom){
      zoom = parseInt(zoom);
      if (zoom >= 0 && zoom <= 20){
        return zoom;
      }
    },

    emptyHash: function(hash){
      return (hash === null || hash === undefined || hash === "");
    },

  };
})();
