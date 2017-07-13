// Basic hash manipulation module
HZApp.HashUtils = (function(){
  return {
    // returns true if the given hash is null, undefined or empty
    hashIsEmpty: function(currentHash){
      return (currentHash === null || currentHash === undefined || currentHash === "");
    },

    // returns a new hash string that that can be passed to location.hash
    removeHashValue: function(hashParam, currentHash){
      // console.log("~~~ removeHashValue(" + hashParam + ", " + currentHash + ")");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside("&" + hashParam);

      if (currentHash.match(hashRegexInside) !== null) {
        return currentHash.replace(hashRegexInside, "");
      } else if (currentHash.match(hashRegexOutside) !== null) {
        return currentHash.replace(hashRegexOutside, "");
      } else {
        return currentHash;
      }
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue, currentHash){
      // console.log("~~~~~ updateHashValue - silent: " + HZApp.Router.silentHashChange.silent);
      var newHash = this.encodeHash(hashParam, hashValue);
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside(hashParam);

      if (this.hashIsEmpty(currentHash)) {
        return newHash;
      } else if (currentHash.match(hashParamRegex) === null) {
        return currentHash + "&" + newHash;
      } else if (currentHash.match(hashRegexInside) !== null) {
        return currentHash.replace(hashRegexInside, newHash + "&");
      } else if (currentHash.match(hashRegexOutside) !== null) {
        return currentHash.replace(hashRegexOutside, newHash);
      } else {
        return "";
      }
    },

    // helper to get just the google map center and zoom and update the hash text
    // returns a new hash string ready to be set in location.hash
    updateCenterAndZoomHash: function(mapCenter, zoom, currentHash){
      var c_hash = this.updateHashValue('center', mapCenter.lat().toFixed(6) + ',' + mapCenter.lng().toFixed(6), currentHash);
      var c_z_hash = this.updateHashValue('zoom', zoom, c_hash);
      return c_z_hash;
    },

    // builds the updated hash string with lat/lng params.
    // expects latlng_s to match /-?\d+(.\d*)?,-?\d+(.\d*)?/, e.g., "10,-20" or "41.986692,-93.877352"
    // returns a new hash string ready to be set in location.hash
    updateLatLngHash: function(latlng_s, currentHash) {
      // console.log("~~~~~ setLatLngInHash - silent: " + HZApp.Router.silentHashChange.silent);
      // Clear any 'q' param
      var hashText = this.removeHashValue('q', currentHash);
      // Add in the 'latlng' param
      hashText = this.updateHashValue('latlng', latlng_s, hashText);
      // Finally, add in the center and zoom
      hashText = this.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), hashText);
      return hashText;
    },

    // builds the updated hash string with query params.
    // expects query_s to be URI encoded
    // returns a new hash string ready to be set in location.hash
    updateQueryHash: function(query_s, currentHash) {
      // console.log("~~~~~ setQueryInHash - silent: " + HZApp.Router.silentHashChange.silent);
      // Clear any 'latlng' param
      var hashText = this.removeHashValue('latlng', currentHash);
      // Add in the 'q' param
      hashText = this.updateHashValue('q', query_s, hashText);
      // Finally, add in the center and zoom
      hashText = this.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), hashText);
      return hashText;
    },

    encodeHash: function(hashParam, hashValue){
      if (hashParam === 'q'){
        return hashParam + "=" + encodeURIComponent(hashValue);
      } else {
        return hashParam + "=" + encodeURI(hashValue);
      }
    },

    // parse the location hash string into an object with key, value pairs
    parseLocationHash: function(hash){
      // console.log("~~~~~ parseLocationHash - silent: " + HZApp.Router.silentHashChange.silent);
      if (this.hashIsEmpty(hash)){
        return null;
      }

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

    //if the hash param is between # and &
    getHashRegexInside: function(hashParam){
      return new RegExp(hashParam + "=" + '.+?\&', "ig");
      //                                     ^ non-greedy match
    },

    // if the hash is between (# and end of line) or (& and end of line)
    getHashRegexOutside: function(hashParam){
      return new RegExp(hashParam + "=" + '.*$', "ig");
    },

  };
})();
