console.log("In the map controller");

//create the map on load, when idle, jump to updateMap to get features
function initMap() {
  console.log('loading map');

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.5, lng: -97.5},
    zoom: 9,
    styles: googleMapsStyleConfig,
    zoomControl: true, 
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });  

  //adds listener that triggers whenever the map is idle to update with new features.
  google.maps.event.addListener(map, 'idle', updateMap);
  //returns the map as a promise
  return map;
};

//function to update the map based on new bounds, get new features from
//geoserver,remove from map any features not in view, add to map 
//any new features in view. 
function updateMap(){
  console.log('i\'m idle, redrawing map');

  var mapScope = this;
  //get the bounding box of the current map and parse as a string
  var mapBounds = mapScope.getBounds();
  var NELat = mapBounds.getNorthEast().lat();
  var NELng = mapBounds.getNorthEast().lng();
  var SWLat = mapBounds.getSouthWest().lat();
  var SWLng = mapBounds.getSouthWest().lng();
  var bbox = [SWLng, SWLat, NELng, NELat].join(',');

  //build the fetch url from seetings 
  var url = [
    geomWFSSettings.urlRoot, 
    'version=1.0.0', 
    'request=GetFeature', 
    'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
    'outputFormat=application/json',
    'srsname=EPSG:'+ geomWFSSettings.srs,
    'bbox=' + bbox + ',EPSG:4326'
  ].join('&');

  //ajax request to geoserver for features, 
  $.ajax(url, {
    success: function(resp){
      // on successful fetch of new features in the bbox, compare old with new and update the map
      if (resp.totalFeatures === null || resp.totalFeatures === undefined){
        console.error('Error Fetching from GeoServer', this.url, resp);
      } else if (resp.totalFeatures > 0){
        //if the currentFeatures is empty, just add it all
        if (currentFeaturesIDs.length === 0){
          // console.log('no other features, adding all');
          mapScope.data.addGeoJson(resp);
          for (var i = resp.features.length - 1; i >= 0; i--) {
            currentFeaturesIDs.push(resp.features[i].properties[geomUniqID]);
          }
        } else {       
          var newFeaturesIDs = [];
          var newFeatures = resp.features.map(function(feature){
            var featureID = feature.properties[geomUniqID]
            newFeaturesIDs.push(featureID)
            return feature;
          });

          var updatedFeaturesIDs = [];

          for (var i = newFeaturesIDs.length - 1; i >= 0; i--) {
            if (!currentFeaturesIDs.includes(newFeaturesIDs[i])){
              // console.log('adding a new feature');
              mapScope.data.addGeoJson(newFeatures[i])
              updatedFeaturesIDs.push(newFeaturesIDs[i]);
            } 
          }

          mapScope.data.forEach(function(feature){
            var featureID = feature.f[geomUniqID];
            if (!newFeaturesIDs.includes(featureID)){
              // console.log('removing a feature');
              mapScope.data.remove(feature);
            } else {
              updatedFeaturesIDs.push(featureID);
            }
          });

          currentFeaturesIDs = updatedFeaturesIDs;
        }
      } else {
        console.warn('No features returned by Geoserver', this.url);
      }
    }, 
    error: function(err){
      console.error('Error Fetching from GeoServer:', 
                    err.status, 
                    err.responseText
      );
    }
  });

  //perform some stlying of features based on some rules, in case arbitrary levels based on size. 
  mapScope.data.setStyle(function(feature) {
    var color = '#205493';
    return {
      fillColor: color,
      opacity: 0.75,
      strokeWeight: 1
    }
  });
  return mapScope;
};