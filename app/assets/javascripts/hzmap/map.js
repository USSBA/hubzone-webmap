//create the map on load, when idle, jump to updateMap to get features
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.5, lng: -97.5},
    zoom: 9,
    styles: googleMapsStyleConfig,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  // adds listener that triggers whenever the map is idle to update with new features.
  google.maps.event.addListener(map, 'idle', function(){
    mapScope = this;

    //get the bbox from the mapScope
    var bbox = getBbox(mapScope);

    //build the fetch url from settings
    var url = getUrl(bbox);

    updateMap({
      mapScope: mapScope,
      url: url
    }, parseGeoserverResponse);
  
  }); 

  //returns the map as a promise
  return map;
};

function getBbox(mapScope) {
  //get the bounding box of the current map and parse as a string
  var mapBounds = mapScope.getBounds();
  var NELat = mapBounds.getNorthEast().lat();
  var NELng = mapBounds.getNorthEast().lng();
  var SWLat = mapBounds.getSouthWest().lat();
  var SWLng = mapBounds.getSouthWest().lng();
  return [SWLng, SWLat, NELng, NELat].join(',');
};

var getUrl = function(bbox) {
  return [
    geomWFSSettings.urlRoot,
    'version=1.0.0',
    'request=GetFeature',
    'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
    'outputFormat=application/json',
    'srsname=EPSG:'+ geomWFSSettings.srs,
    'bbox=' + bbox + ',EPSG:4326'
  ].join('&');
};

var defaultMapStyle = function(feature) {
  var color = '#205493';
  return {
    fillColor: color,
    opacity: 0.75,
    strokeWeight: 1
  }
};

//callback for handling the goeserver response
//block of code proves problematic to test since it relys on the google map functions addGeoJson, forEach, and remove...
//but its helper class (mapGeoJson) has been tested, and the ajax method that calls it was tested
function parseGeoserverResponse(resp){
  // on successful fetch of new features in the bbox, compare old with new and update the map
  if (resp.totalFeatures === null || resp.totalFeatures === undefined){
    console.error('Error Fetching from GeoServer', this.url, resp);
  } else if (resp.totalFeatures > 0){
    mapGeoJson.diffData(resp);
    if (mapGeoJson.featuresToAdd.totalFeatures > 0) {
      mapScope.data.addGeoJson(mapGeoJson.featuresToAdd);
    }
    if (mapGeoJson.featuresToRemove.length > 0){
      mapScope.data.forEach(function(feature){
        if (mapGeoJson.featuresToRemove.includes(feature.f[geomUniqID])){
          mapScope.data.remove(feature);
        }
      });
    }
  } else {
    console.warn('No features returned by Geoserver', this.url);
  }
  return mapGeoJson;
};

//function to update the map based on new bounds, get new features from
//geoserver,remove from map any features not in view, add to map
//any new features in view.
function updateMap(options, callback){
  var mapScope = options.mapScope;
  var url = options.url

  //ajax request to geoserver for features,
  $.ajax({
    url: url, 
    success: function(resp){
      callback(resp);
    },
    error: function(err){
      console.error('Error Fetching from GeoServer:', err.status, err.responseText);
    }
  });

  //perform some stlying of features based on some rules, in case arbitrary levels based on size.
  mapScope.data.setStyle(defaultMapStyle);
  return mapScope;
};

//jump to location on the map based on the geocode viewport object
function jumpToLocation(geocodeViewport){
  var newBounds = new google.maps.LatLngBounds(
         new google.maps.LatLng(geocodeViewport.southwest.lat, geocodeViewport.southwest.lng), // SW
         new google.maps.LatLng(geocodeViewport.northeast.lat, geocodeViewport.northeast.lng)    // NE
  );
  map.fitBounds(newBounds);
  return map.getBounds();
};


























