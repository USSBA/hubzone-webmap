// Basic hash router module
HZApp.Router = (function(){

  // still need to listen on page load to check for latlng values
  if (HZApp.config.bindWindowEvents){
    window.addEventListener('load', function(){
      HZApp.Router.catchPageLoad();
    });

    // listen on hashchanges
    window.addEventListener('hashchange', function(){
      HZApp.Router.catchHashChange();
    });
  }

  return {

    // ################## window event listeners #############################

    catchPageLoad: function(){
      // console.log("~~~~~ catchPageLoad - silent: " + HZApp.Router.silentHashChange.silent);
      if (!HZApp.HashUtils.hashIsEmpty(location.hash)){
        HZApp.Router.updateStateFromHash(location.hash, true);
      }
      //add listener for map idle to update router hash center and zoom
      // google.maps.event.addListener(HZApp.map, 'idle', HZApp.Router.updateMapLocation);
      google.maps.event.addListener(HZApp.map, 'center_changed', HZApp.Router.updateMapCenter);
      google.maps.event.addListener(HZApp.map, 'zoom_changed', HZApp.Router.updateMapZoom);
      // HZApp.Router.silentHashChange.setSilent(false, 'mapLoad');
    },

    // catch and flow control hash changes
    catchHashChange: function(){
      // console.log("!!! catchHashChange");
      if (HZApp.Router.silentHashChange.silent) {
        // console.log('  was a silent change');
        HZApp.Router.silentHashChange.setSilent(false, 'catchHashChange');
      } else {
        // console.log('  hash changed');
        // console.trace();
        HZApp.Router.updateStateFromHash(location.hash);
      }
    },

    // #######################################################

    // ################## callbacks #############################

    updateMapCenter: function(event){ // jshint unused: false
      // console.log("!!! updateMapCenter", event);
      HZApp.Router.currentMapLocationToHash();
    },
    updateMapZoom: function(event){ // jshint unused: false
      // console.log("!!! updateMapZoom", event);
      HZApp.Router.currentMapLocationToHash();
    },

    // #######################################################

    // ################## set hash block #############################
    silentHashChange: {
      setSilent: function(x,caller){
        this.history.push([Date.now(), x, caller].join(', '));
        this.silent = x;
      },
      silent: false,
      history: []
    },
    mapLoadedWithoutLocation: false,
    hashOnPageLoad: {},

    // This is the main and only point which is allowed to set the hash
    setHash: function(hash){
      var startingHash = HZApp.HashUtils.parseLocationHash(location.hash);
      if (HZApp.HashUtils.hashSearchOnly(startingHash)){
        // console.log("~~~~~ setHash -- query only, so replaceHash instead!");
        HZApp.Router.replaceHash(hash);
      } else {
        // console.log('~~~~~ setHash: ' + hash);
        if (hash !== location.hash){
          HZApp.Router.silentHashChange.setSilent(true, 'setHash');
          location.hash = hash;
        }
      }
    },

    // update a single hash in the hash
    setSingleHash: function(hashParam, hashValue, currentHash){
      currentHash = currentHash || location.hash;
      HZApp.Router.setHash(HZApp.HashUtils.updateHashValue(hashParam, hashValue, currentHash));
    },

    // helper to get just the google map center and zoom and update the hash from that
    // but set them together to only trigger one event
    setCenterAndZoomHash: function(mapCenter, zoom){
      HZApp.Router.setHash(HZApp.HashUtils.updateCenterAndZoomHash(mapCenter, zoom, location.hash));
    },

    // get the updated hash text, then set it in the location.hash
    setLatLngHash: function(latlng_s) {
      // console.log("~~~~ setLatLngHash: " + latlng_s);
      HZApp.Router.setHash(HZApp.HashUtils.updateLatLngHash(latlng_s, location.hash));
    },

    // get the updated hash text, then set it in the location.hash
    setQueryHash: function(query_s) {
      // console.log("~~~~ setQueryHash: " + query_s);
      HZApp.Router.setHash(HZApp.HashUtils.updateQueryHash(query_s, location.hash));
    },

    replaceHash: function(hash) {
      // console.log('~~~~~ replaceHash: ' + hash);
      // console.trace();
      if (hash === location.hash){ return null; }
      hash = HZApp.HashUtils.stripHashmark(hash);

      var startingHash = HZApp.HashUtils.parseLocationHash(location.hash); if (!HZApp.HashUtils.hashSearchOnly(startingHash)){
        HZApp.Router.silentHashChange.setSilent(true, 'replaceHash');
      }

      history.replaceState(HZApp.HashUtils.parseLocationHash(hash), "replaceHash", "map#" + hash);
    },

    currentMapLocationToHash: function() {
      // console.log("~~~~~ currentMapLocationToHash");
      var hashText = HZApp.HashUtils.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), location.hash);
      history.replaceState(HZApp.HashUtils.parseLocationHash(hashText), "location update only", "map" + hashText);
    },


    // #######################################################

    // ################## clear hash block #############################

    // clear the hash completly, or clear a parameter
    clearHash: function(hashParam){
      hashParam = hashParam || null;
      if (hashParam){
        HZApp.Router.findAndRemoveHashParam(hashParam);
      } else {
        HZApp.Router.setHash("");
      }
    },

    findAndRemoveHashParam: function(hashParam){
      HZApp.Router.setHash(HZApp.HashUtils.removeHashValue(hashParam, location.hash));
    },
    // #######################################################

    // ################## update state from hash block #############################

    // update the app state from the hash
    updateStateFromHash: function(hash){

      //console.log("    ~~~~~ updateStateFromHash: " + hash);
      var hashState = HZApp.HashUtils.parseLocationHash(hash); // HZApp.Router.unpackHash(hash);
      if (HZApp.HashUtils.hashNoSearch(hashState)){
        HZApp.MapUtils.resetMap();
      } else if (HZApp.HashUtils.hashLatLngOnly(hashState)) {
        // handle updating the map state when only LatLng Provided
        console.log("only latlng provided...hopefully :)");
        HZApp.Router.updateStateWithOnlyHash(hash);
      }

      // DCP: Are the keys guaranteed to come back in the order defined?  Does it matter? (seems like it should)
      Object.keys(HZApp.Router.hashControllers).forEach(function(controller){
        // console.log("       checking for " + controller + "...");
        if (hashState && hashState[controller]){
          // console.log(controller);
          HZApp.Router.hashControllers[controller](hashState[controller], hashState);
        }
      });
    },

    updateStateWithOnlyHash: function(hash) {
      // update map state to be zoom = 15 and centered on provided latlng
      console.log(hash);
    },

    // sleep: function(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // },

    // define the actions for different hash params
    hashControllers: {
      latlng: function(latlng_s, hashState){ //jshint ignore:line
        // console.log("        ~~~~~ hashControllers.latlng: " + latlng_s);
        var latlng = HZApp.Router.unpackValidLatLng(latlng_s) || null;
        if (latlng){
          HZApp.MapUtils.sendMapClick(latlng, function(){
            HZApp.Router.setLatLngHash(latlng_s);
          });
        }
      },
      q: function(query, hashState){ //jshint ignore:line
        // console.log("        ~~~~~ hashControllers.q: " + query);
        var search = HZApp.Router.unpackValidSearch(query) || null;
        if (search){
          HZApp.GA.trackSubmit('search', '#search-field-small');
          document.getElementById('search-field-small').value = search;
          HZApp.MapUtils.sendMapSearch(search, function(){
            // console.log("      !!! map search complete!");
            // HZApp.Router.setQueryHash(search);
          });
        }
      },
      center: function(center, hashState){
        // await HZapp.Router.sleep(5000);
        // console.log("        ~~~~~ hashControllers.center: " + center);
        HZApp.Router.updateMapCenterAndZoom(hashState);
      },
      zoom: function(zoom, hashState){
        // console.log("        ~~~~~ hashControllers.zoom: " + zoom);
        HZApp.Router.updateMapCenterAndZoom(hashState);
      },
    },

    updateMapCenterAndZoom: function(hashState){
      // HZApp.Router.silentHashChange.setSilent(true, 'updateMapCenterAndZoom');
      HZApp.Router.updateZoom(hashState.zoom);
      HZApp.Router.updateCenter(hashState.center);
      //HZApp.Router.silentHashChange.setSilent(false, 'updateMapCenterAndZoom');
    },

    updateZoom: function(hash_zoom){
      var zoom = HZApp.Router.unpackValidZoom(hash_zoom) || null;
      if (zoom){
        HZApp.map.setZoom(zoom);
      }
    },

    updateCenter: function(hash_center){
      var center = HZApp.Router.unpackValidLatLng(hash_center) || null;
      if (center){
        HZApp.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
      }
    },

    // #######################################################

    // update the mapLocation object based on checking the contents of the hash
    unpackInitialMapLocation: function(mapLocation, hash){
      // console.log("~~~~~ unpackInitialMapLocation - silent: " + HZApp.Router.silentHashChange.silent);
      if (!HZApp.HashUtils.hashIsEmpty(hash)){
        var unpackedHash = HZApp.HashUtils.parseLocationHash(hash);
        HZApp.Router.hashOnPageLoad = unpackedHash;
        return HZApp.Router.checkValidHashParams(mapLocation, unpackedHash);
      } else {
        var center = {
          lat: function() { return mapLocation.center.lat; },
          lng: function() { return mapLocation.center.lng; }
        };
        HZApp.Router.replaceHash(HZApp.HashUtils.updateCenterAndZoomHash(center, mapLocation.zoom, ""));
        return mapLocation;
      }
    },

    // check if the hash has valid parameters
    // update useGeoLocation based on whether valid hash params were found
    checkValidHashParams: function(mapLocation, hashState){
      // console.log("~~~~~ checkValidHashParams - silent: " + HZApp.Router.silentHashChange.silent);
      var validParams = HZApp.Router.unpackValidParams(hashState);
      HZApp.Router.mapLoadedWithoutLocation = HZApp.Router.missingCenterAndZoom(validParams);
      mapLocation.center = validParams.center || mapLocation.center;
      mapLocation.zoom = validParams.zoom || mapLocation.zoom;
      return mapLocation;
    },

    unpackValidParams: function(hashState){
      var validParams = {};
      validParams['center'] = HZApp.Router.unpackValidLatLng(hashState.center);
      validParams['zoom'] = HZApp.Router.unpackValidZoom(hashState.zoom);
      validParams['q'] = HZApp.Router.unpackValidSearch(hashState.q);
      validParams['latlng'] = HZApp.Router.unpackValidLatLng(hashState.latlng);
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

    // check if the map was loaded without center and zoom
    missingCenterAndZoom: function(validParams){
      return (!validParams.zoom || !validParams.center);
    },

  };
})();



/*


(good is that the app never reaches the update block and when it is done the silent var is set to false)


UpdateStateFromHash on page load
load map empty - good
load center + zoom - good
load center - good
load zoom - good
load latlng - good
load center + latlng - good
load zoom + latlng - good
load center + zoom + latlng - good
load center + zoom, then search - good
load search + center - good
load search + zoom - good
load search only - good


Catch page changes
map click - good
map click + zoom - good
map click + pan - good
map click + pan + map click - good
map click + clear - good
search + clear - good

***** click then search - bad (triggers hash change, but still sets silent to false)
***** load search + center + zoom - bad (doesnt trigger change, but leaves silent = true)
***** search then map click - bad (triggers hash change, but still sets silent to false))

*/
