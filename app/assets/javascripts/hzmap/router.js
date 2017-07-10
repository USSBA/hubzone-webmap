// Basic hash router module
HZApp.Router = (function(){

  // still need to listen on page load to check for latlng values
  window.addEventListener('load', function(){
    HZApp.Router.catchPageLoad();
  });

  // listen on hashchanges
  window.addEventListener('hashchange', function(){
    HZApp.Router.catchHashChange();
  });

  return {

    // ################## set hash block #############################
    silentHashChange: {
      setSilent: function(x,caller){
        this.history.push([caller, x].join(', '));
        this.silent = x;
      },
      silent: false,
      history: []
    },
    mapLoadedWithoutLocation: false,
    hashOnPageLoad: {},

    // this is the main and only point which is allowed to set the hash
    setHash: function(hash){
      console.log(HZApp.Router.silentHashChange.silent);
      if (hash !== location.hash){
        location.hash = hash;
      }
    },

    // update a single hash in the hash
    setSingleHash: function(hashParam, hashValue, currentHash, silent){
      silent = silent || false;
      HZApp.Router.silentHashChange.setSilent(silent, 'setSingleHash');

      currentHash = currentHash || location.hash;
      this.setHash(this.updateHashValue(hashParam, hashValue, currentHash));
    },

    // helper to get just the google map center and zoom and update the hash from that
    // but set them together to only trigger one event
    setCenterAndZoomHash: function(mapCenter, zoom, silent){
      console.log('here', silent)
      var c_hash = this.updateHashValue('center', mapCenter.lat().toFixed(6) + ',' + mapCenter.lng().toFixed(6), location.hash);
      var c_z_hash = this.updateHashValue('zoom', zoom, c_hash);
      silent = silent || false;
      HZApp.Router.silentHashChange.setSilent(silent, 'setCenterAndZoomHash');
      this.setHash(c_z_hash);
    },

    // returns a new hash string that that can be passed to location.hash
    updateHashValue: function(hashParam, hashValue, currentHash){
      var newHash = this.encodeHash(hashParam, hashValue);
      var hashParamRegex = new RegExp(hashParam + "=", "ig");
      var hashRegexInside = this.getHashRegexInside(hashParam);
      var hashRegexOutside = this.getHashRegexOutside(hashParam);

      if (this.emptyHash(currentHash)) {
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

    encodeHash: function(hashParam, hashValue){
      if (hashParam === 'q'){
        return hashParam + "=" + encodeURIComponent(hashValue);
      } else {
        return hashParam + "=" + encodeURI(hashValue);
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

    // #######################################################

    // ################## clear hash block #############################

    // clear the hash completly, or clear a parameter
    clearHash: function(hashParam, silent){
      hashParam = hashParam || null;
      silent = silent || false;
      HZApp.Router.silentHashChange.setSilent(silent, 'clearHash');
      if (hashParam){
        this.setHash(this.findAndRemoveHashParam(hashParam));
      } else {
        this.setHash("");
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
    // #######################################################

    // ################## window event listeners #############################

    catchPageLoad: function(){
      if (!HZApp.Router.emptyHash(location.hash)){
        HZApp.Router.updateStateFromHash(location.hash, true);
      }
    },

    // catch and flow control hash changes
    catchHashChange: function(){
      console.log(HZApp.Router.silentHashChange.silent);

      if (HZApp.Router.silentHashChange.silent) {
        console.log('was a silent change');
        HZApp.Router.silentHashChange.setSilent(false, 'catchHashChange');
      } else {
        console.log('hash changed');
        console.trace();
        // HZApp.Router.updateStateFromHash(location.hash);
      }
    },

    // #######################################################

    // ################## update state from hash block #############################

    // update the app state from the hash
    updateStateFromHash: function(hash, silent){
      var hashState = this.unpackHash(hash);
      Object.keys(this.hashControllers).forEach(function(controller){
        if (hashState && hashState[controller]){
          HZApp.Router.hashControllers[controller](hashState[controller], silent, hashState);
        }
      });
    },

    // unpack the hash parameters and values
    unpackHash: function(hash){
      if (this.emptyHash(hash)){
        return null;
      } else {
        return this.parseLocationHash(hash);
      }
    },

    // define the actions for different hash params
    hashControllers: {
      center: function(center, silent, hashState){
        HZApp.Router.updateMapCenterAndZoom(hashState);
      },
      zoom: function(zoom, silent, hashState){
        HZApp.Router.updateMapCenterAndZoom(hashState);
      },
      latlng: function(latlng_s, silent, hashState){
        var latlng = HZApp.Router.unpackValidLatLng(latlng_s) || null;
        if (latlng){
          HZApp.MapUtils.sendMapClick(latlng, function(){
            HZApp.Router.clearHash('q', silent);
            HZApp.Router.setSingleHash('latlng', latlng_s, null, silent);
            HZApp.Router.setCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), silent);
            HZApp.Router.silentHashChange.setSilent(false, 'latlng controller')
          });
        }
      },
      q: function(q, silent, hashState){
        var search = HZApp.Router.unpackValidSearch(q) || null;
        if (search){
          HZApp.GA.trackSubmit('search', '#search-field-small');
          document.getElementById('search-field-small').value = search;
          HZApp.MapUtils.sendMapSearch(search, function(){
            HZApp.Router.updateMapCenterAndZoom(HZApp.Router.hashOnPageLoad);
          });
        }
      },
    },

    updateMapCenterAndZoom: function(hashState, silent){
      silent = silent || false;
      HZApp.Router.silentHashChange.setSilent(silent, 'updateMapCenterAndZoom');
      var zoom = HZApp.Router.unpackValidZoom(hashState.zoom) || null;
      if (zoom){
        HZApp.map.setZoom(zoom);
      }
      var center = HZApp.Router.unpackValidLatLng(hashState.center) || null;
      if (center){
        HZApp.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
      }
    },

    // #######################################################

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
        var unpackedHash = this.unpackHash(hash);
        this.hashOnPageLoad = unpackedHash;
        return this.checkValidHashParams(mapLocation, unpackedHash);
      } else {
        return mapLocation;
      }
    },

    // check if the hash has valid parameters
    // update useGeoLocation based on whether valid hash params were found
    checkValidHashParams: function(mapLocation, hashState){
      var validParams = this.unpackValidParams(hashState);
      HZApp.Router.mapLoadedWithoutLocation = this.missingCenterAndZoom(validParams);
      mapLocation.center = validParams.center || mapLocation.center;
      mapLocation.zoom = validParams.zoom || mapLocation.zoom;
      return mapLocation;
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

    // check if the map was loaded without center and zoom
    missingCenterAndZoom: function(validParams){
      return (!validParams.zoom || !validParams.center);
    },

  };
})();
