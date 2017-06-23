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
      this.setHash('center', mapCenter.lat() + ',' + mapCenter.lng());
      this.setHash('zoom', zoom);
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue){
      var newHash = hashParam + "=" + hashValue;
      var updatedHash = "";
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = new RegExp(hashParam + "=" + '.+?(?=\&)', "ig"); //if the hash is between # and &
      var hashRegexOutside = new RegExp(hashParam + "=" + '.+?(?=$)', "ig"); // if the hash is between (# and end of line) or (& and end of line)

      if (location.hash === "") {
        updatedHash = newHash;
      } else if (location.hash.match(hashParamRegex) === null) {
        updatedHash = location.hash + "&" + newHash;
      } else if (location.hash.match(hashRegexInside) !== null) {
        updatedHash = location.hash.replace(hashRegexInside, newHash);
      } else if (location.hash.match(hashRegexOutside) !== null) {
        updatedHash = location.hash.replace(hashRegexOutside, newHash);
      }
      return updatedHash;
    },

  };
})();
