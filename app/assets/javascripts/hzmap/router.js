// Basic hash router module
HZApp.Router = (function(){

  // still need to listen on page load to check for latlng values
  window.addEventListener('load', function(){
    HZApp.Router.catchPageLoad();
  });

  // listen on hashchanges
  window.addEventListener('hashchange', function(event){
    HZApp.Router.catchHashChange(event);
  });

  return {

    // ################## window event listeners #############################

    catchPageLoad: function(){
      // console.log("~~~~~ catchPageLoad - silent: " + HZApp.Router.silentHashChange.silent);
      if (!HZApp.HashUtils.hashIsEmpty(location.hash)){
        HZApp.Router.updateStateFromHash(location.hash, true);
      }
      //add listener for map idle to update router hash center and zoom
      google.maps.event.addListener(HZApp.map, 'idle', HZApp.Router.updateMapLocation);
      // HZApp.Router.silentHashChange.setSilent(false, 'mapLoad');
    },

    // catch and flow control hash changes
    catchHashChange: function(event){
      // console.log("!!! catchHashChange");
      if (HZApp.Router.silentHashChange.silent) {
        // console.log('was a silent change');
        HZApp.Router.silentHashChange.setSilent(false, 'catchHashChange');
      } else {
        // console.log("~~~~~ catchHashChange");
        // console.log('hash changed');
        // console.trace();
        HZApp.Router.updateStateFromHash(location.hash, true);
      }
    },

    // #######################################################

    // ################## callbacks #############################

    // map idle listener callback for updatig the map url route when the page is done moving
    updateMapLocation: function(){
      // console.log("!!! updateMapLocation - center: " + HZApp.map.getCenter() + ", zoom: " + HZApp.map.getZoom());
      // console.trace();
      HZApp.Router.setCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom());
      // dont set anything else here
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
      // console.log('~~~~~ setHash: ' + hash);
      // console.trace();
      if (hash !== location.hash){
        HZApp.Router.silentHashChange.setSilent(true, 'setHash');
        location.hash = hash;
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
      HZApp.Router.setHash(HZApp.HashUtils.updateLatLngHash(latlng_s, location.hash));
    },

    // get the updated hash text, then set it in the location.hash
    setQueryHash: function(query_s) {
      HZApp.Router.setHash(HZApp.HashUtils.updateQueryHash(query_s, location.hash));
    },

    currentMapLocationToHash: function(currentHash) {
      var hashText = HZApp.HashUtils.updateCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom());
      history.replaceState(HZApp.HashUtils.parseLocationHash(hashText), "location update only", "map#" + hashText);
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
    updateStateFromHash: function(hash, silent){
      // console.log("    ~~~~~ updateStateFromHash: " + hash);
      var hashState = HZApp.HashUtils.parseLocationHash(hash); // HZApp.Router.unpackHash(hash);
      // console.log("hashState: " + hashState);

      // DCP: Are the keys guaranteed to come back in the order defined?  Does it matter? (seems like it should)
      Object.keys(HZApp.Router.hashControllers).forEach(function(controller){
        // console.log("       checking for " + controller + "...");
        if (hashState && hashState[controller]){
          // console.log(controller);
          HZApp.Router.hashControllers[controller](hashState[controller], silent, hashState);
        }
      });
    },

    // sleep: function(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // },

    // define the actions for different hash params
    hashControllers: {
      latlng: function(latlng_s, silent, hashState){ //jshint ignore:line
        // console.log("        ~~~~~ hashControllers.latlng: " + latlng_s);
        var latlng = HZApp.Router.unpackValidLatLng(latlng_s) || null;
        if (latlng){
          HZApp.MapUtils.sendMapClick(latlng, function(){
            HZApp.Router.clearHash('q', silent);
            HZApp.Router.setSingleHash('latlng', latlng_s, null, silent);
            HZApp.Router.setCenterAndZoomHash(HZApp.map.getCenter(), HZApp.map.getZoom(), silent);
            // HZApp.Router.silentHashChange.setSilent(false, 'latlng controller');
          });
        }
      },
      q: function(q, silent, hashState){ //jshint ignore:line
        // console.log("        ~~~~~ hashControllers.q: " + q);
        var search = HZApp.Router.unpackValidSearch(q) || null;
        if (search){
          HZApp.GA.trackSubmit('search', '#search-field-small');
          document.getElementById('search-field-small').value = search;
          HZApp.MapUtils.sendMapSearch(search, null);
        }
      },
      center: function(center, silent, hashState){
        // await HZapp.Router.sleep(5000);
        // console.log("        ~~~~~ hashControllers.center: " + center);
        HZApp.Router.updateMapCenterAndZoom(hashState, silent);
      },
      zoom: function(zoom, silent, hashState){
        // console.log("        ~~~~~ hashControllers.zoom: " + zoom);
        HZApp.Router.updateMapCenterAndZoom(hashState, silent);
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
        var unpackedHash = HZApp.HashUtils.parseLocationHash(hash); // HZApp.Router.unpackHash(hash);
        HZApp.Router.hashOnPageLoad = unpackedHash;
        return HZApp.Router.checkValidHashParams(mapLocation, unpackedHash);
      } else {
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
