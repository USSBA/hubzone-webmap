// Basic hash router module
HZApp.Router = (function(){
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
  };
})();
