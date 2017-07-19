// Basic hash manipulation module
HZApp.HashUtils = (function(){
  return {
    // returns true if the given hash is null, undefined or empty
    hashIsEmpty: function(currentHash){
      return (currentHash === null || currentHash === undefined || currentHash === "");
    },

    // returns true if the hash ONLY contains center and zoom
    hashNoSearch: function(currentHash){
      return (currentHash.center && currentHash.zoom && (currentHash.latlng === undefined && currentHash.q === undefined));
    },

    // returns a new hash string that that can be passed to location.hash
    removeHashValue: function(hashParam, currentHash){
      // console.log("~~~ removeHashValue(" + hashParam + ", " + currentHash + ")");
      var hashRegexInside = HZApp.HashUtils.getHashRegexInside(hashParam);
      var hashRegexOutside = HZApp.HashUtils.getHashRegexOutside("&" + hashParam);

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
      var newHash = HZApp.HashUtils.encodeHash(hashParam, hashValue);
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = HZApp.HashUtils.getHashRegexInside(hashParam);
      var hashRegexOutside = HZApp.HashUtils.getHashRegexOutside(hashParam);

      if (HZApp.HashUtils.hashIsEmpty(currentHash)) {
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
      var c_hash = HZApp.HashUtils.updateCenterHash(mapCenter.lat(), mapCenter.lng(), currentHash);
      var c_z_hash = HZApp.HashUtils.updateZoomHash(zoom, c_hash);
      return c_z_hash;
    },

    // helper to get just the google map center and zoom and update the hash text
    // returns a new hash string ready to be set in location.hash
    updateCenterHash: function(lat, lng, currentHash){
      var c_hash = HZApp.HashUtils.updateHashValue('center', lat.toFixed(6) + ',' + lng.toFixed(6), currentHash);
      return c_hash;
    },

    // helper to get just the google map center and zoom and update the hash text
    // returns a new hash string ready to be set in location.hash
    updateZoomHash: function(zoom, currentHash){
      var z_hash = HZApp.HashUtils.updateHashValue('zoom', zoom, currentHash);
      return z_hash;
    },

    // builds the updated hash string with lat/lng params.
    // expects latlng_s to match /-?\d+(.\d*)?,-?\d+(.\d*)?/, e.g., "10,-20" or "41.986692,-93.877352"
    // returns a new hash string ready to be set in location.hash
    updateLatLngHash: function(latlng_s, currentHash) {
      // console.log("~~~~~ setLatLngInHash - silent: " + HZApp.Router.silentHashChange.silent);
      // Clear any 'q' param
      var hashText = HZApp.HashUtils.removeHashValue('q', currentHash);
      // Add in the 'latlng' param
      hashText = HZApp.HashUtils.updateHashValue('latlng', latlng_s, hashText);
      // Finally, add in the center and zoom
      hashText = HZApp.HashUtils.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), hashText);
      return hashText;
    },

    // builds the updated hash string with query params.
    // expects query_s to be URI encoded
    // returns a new hash string ready to be set in location.hash
    updateQueryHash: function(query_s, currentHash) {
      // console.log("~~~~~ setQueryInHash - silent: " + HZApp.Router.silentHashChange.silent);
      // Clear any 'latlng' param
      var hashText = HZApp.HashUtils.removeHashValue('latlng', currentHash);
      // Add in the 'q' param
      hashText = HZApp.HashUtils.updateHashValue('q', query_s, hashText);
      // Finally, add in the center and zoom
      hashText = HZApp.HashUtils.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), hashText);
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
      if (HZApp.HashUtils.hashIsEmpty(hash)){
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
    }
  };
})();
