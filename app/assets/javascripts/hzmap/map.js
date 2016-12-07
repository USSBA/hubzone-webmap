//create the map on load, when idle, jump to updateMap to get features
/* exported initMap */
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.5, lng: -97.5},
    zoom: 9,
    zoomControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['hz_map', 'roadmap', 'satellite' ],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  });

  //adds in the hz style into the basemap picker
  var hzStyledMap = new google.maps.StyledMapType(hzBaseMapStyle, {name: 'Default'});
  map.mapTypes.set('hz_map', hzStyledMap);
  map.setMapTypeId('hz_map');

  //adds the map legend
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('legend'));

  // adds listener that triggers whenever the map is idle to update with new features.
  google.maps.event.addListener(map, 'idle', function(){
    mapScope = this;

    //get the bbox from the mapScope
    var bbox = getBbox(mapScope);

    //build the fetch url from settings
    var currentZoom = mapScope.getZoom();
    var url = getUrl(bbox, currentZoom);

    updateMap({
      mapScope: mapScope,
      url: url
    }, parseGeoserverResponse);

  });

  map.addListener('click', catchMapClick);

  map.data.addListener('click', catchMapClick);

  //returns the map as a promise
  return map;
}

function getBbox(mapScope) {
  //get the bounding box of the current map and parse as a string
  var mapBounds = mapScope.getBounds();
  var NELat = mapBounds.getNorthEast().lat();
  var NELng = mapBounds.getNorthEast().lng();
  var SWLat = mapBounds.getSouthWest().lat();
  var SWLng = mapBounds.getSouthWest().lng();
  return [SWLng, SWLat, NELng, NELat].join(',');
}

function getTableBasedOnZoomLevel(currentZoom){
  var table = geomWFSSettings.tableHighRes;
  if (currentZoom >= 12) {
    table = geomWFSSettings.tableHighRes;
  } else if (currentZoom >= 10){
    table = geomWFSSettings.tableLowRes;
  } else if (currentZoom >= 6){
    table = geomWFSSettings.tableLowerRes;
  } else {
    table = geomWFSSettings.tableLowestRes;
  }
  return table;
}

function getUrl(bbox, currentZoom) {

  var table = getTableBasedOnZoomLevel(currentZoom);
  return [
    geomWFSSettings.urlRoot,
    'version=1.0.0',
    'request=GetFeature',
    'typename=' + geomWFSSettings.db + ':' + table,
    'outputFormat=application/json',
    'srsname=EPSG:'+ geomWFSSettings.srs,
    'bbox=' + bbox + ',EPSG:4326'
  ].join('&');
}

function defaultMapStyle(feature) {
  var hzType = feature.getProperty('hztype');
  var hzStopDate = feature.getProperty('stop');

  if (hzStopDate == null) {
    return hzMapLayerStyle[hzType];
  } else {
    return hzMapLayerStyle[hzType + "_expiring"];
  }
}

//callback for handling the goeserver response
//block of code proves problematic to test since it relys on the google map functions addGeoJson, forEach, and remove...
//but its helper class (mapGeoJson) has been tested, and the ajax method that calls it was tested
function parseGeoserverResponse(resp){

  // on successful fetch of new features in the bbox, compare old with new and update the map
  if (resp.totalFeatures === null || resp.totalFeatures === undefined){
    console.error('Error Fetching from GeoServer', resp);
  } else if (resp.totalFeatures > 0){
    var diffFeatures = mapGeoJson.diffData(resp);
    if (diffFeatures.toAdd.fc.totalFeatures > 0) {
      mapScope.data.addGeoJson(diffFeatures.toAdd.fc);
    }
    if (diffFeatures.toRemove.ids.length > 0){
      for (var i = 0; i < diffFeatures.toRemove.ids.length; i++) {
        mapScope.data.remove(mapScope.data.getFeatureById(diffFeatures.toRemove.ids[i]));
      }
    }
  } else {
    console.warn('No features returned by Geoserver');
    // if there are not new features, make sure to dump all the old ones
    mapGeoJson.emptyCurrentFeatures();
    mapScope.data.forEach(function(feature){
      mapScope.data.remove(feature);
    });
  }

  return mapGeoJson;
}

//function to update the map based on new bounds, get new features from
//geoserver,remove from map any features not in view, add to map
//any new features in view.
function updateMap(options, callback){
  var mapScope = options.mapScope;
  var url = options.url;

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
}

//jump to location on the map based on the geocode viewport object
/* exported jumpToLocation */
function jumpToLocation(geocodeLocation){
  if (geocodeLocation.viewport){
    var newBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(geocodeLocation.viewport.southwest.lat, geocodeLocation.viewport.southwest.lng),
      new google.maps.LatLng(geocodeLocation.viewport.northeast.lat, geocodeLocation.viewport.northeast.lng)
    );
    mapScope.fitBounds(newBounds);
  }
}

// turn latlng object into url
function catchMapClick(clickEvent){
  var clicklng = clickEvent.latLng.lng();
  var clicklat = clickEvent.latLng.lat();
  var url = "/search?latlng=" + clicklat + ',' + clicklng;
  $.ajax({
    url: url
  });
  return url;
}
