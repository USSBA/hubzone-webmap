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

      if (location.hash.match(hashRegexInside) !== null) {
        return location.hash.replace(hashRegexInside, "");
      } else if (location.hash.match(hashRegexOutside) !== null) {
        return location.hash.replace(hashRegexOutside, "");
      } else {
        return location.hash;
      }
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue){
      var newHash;
      if (hashParam === 'q'){
        newHash = hashParam + "=" + encodeURIComponent(hashValue);
      } else {
        newHash = hashParam + "=" + encodeURI(hashValue);
      }
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside(hashParam);

      if (this.emptyHash(location.hash)) {
        return newHash;
      } else if (location.hash.match(hashParamRegex) === null) {
        return location.hash + "&" + newHash;
      } else if (location.hash.match(hashRegexInside) !== null) {
        return location.hash.replace(hashRegexInside, newHash + "&");
      } else if (location.hash.match(hashRegexOutside) !== null) {
        return location.hash.replace(hashRegexOutside, newHash);
      } else {
        return "";
      }
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
      q: function(q, hashState){
        var search = HZApp.Router.unpackValidSearch(q) || null;
        if (search){
          HZApp.GA.trackSubmit('search', '#search-field-small');
          document.getElementById('search-field-small').value = search;
          HZApp.MapUtils.sendMapSearch(search, function(){
            HZApp.Router.updateMapCenterAndZoom(hashState);
          });
        }
      },
    },

    //
    updateMapCenterAndZoom: function(hashState){
      var zoom = HZApp.Router.unpackValidZoom(hashState.zoom) || null;
      if (zoom){
        HZApp.map.setZoom(zoom);
      }
      var center = HZApp.Router.unpackValidLatLng(hashState.center) || null;
      if (center){
        HZApp.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
      }
    },

    // update the app state from the hash
    updateStateFromHash: function(hash){
      if (!this.emptyHash(hash)){
        var hashState = this.unpackHash(hash);
        Object.keys(this.hashControllers).forEach(function(controller){
          if (hashState[controller]){
            HZApp.Router.hashControllers[controller](hashState[controller], hashState);
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

    // check if the hash has valid parameters
    // update useGeoLocation based on whether valid hash params were found
    checkValidHashParams: function(mapLocation, hashState){
      var validParams = this.unpackValidParams(hashState);
      mapLocation.center = validParams.center || mapLocation.center;
      mapLocation.zoom = validParams.zoom || mapLocation.zoom;
      mapLocation.useGeoLocation = this.dontGeolocate(validParams);
      return mapLocation;
    },

    // if any are present, return false to not geolocate
    dontGeolocate: function(validParams){
      return !(validParams.zoom || validParams.center || validParams.q);
    },

    unpackValidParams: function(hashState){
      var validParams = {};
      validParams['center'] = this.unpackValidLatLng(hashState.center);
      validParams['zoom'] = this.unpackValidZoom(hashState.zoom);
      validParams['q'] = this.unpackValidSearch(hashState.q);
      validParams['latlng'] = this.unpackValidLatLng(hashState.latlng);
      return validParams;
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

    // check for a valid search string
    unpackValidSearch: function(search){
      if (typeof(search) === 'string'){
        return decodeURIComponent(search);
      }
    },

    emptyHash: function(hash){
      return (hash === null || hash === undefined || hash === "");
    },

  };
})();
