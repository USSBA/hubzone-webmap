// Basic hash router module
HZApp.Router = (function(){
  return {

    setHash: function(hashValue, hashParam){
      location.hash = this.updateHashValue(hashValue, hashParam);
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashValue, hashParam){
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
