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
    //for each layer defined in the wmsGroundOverlay object call the fetchNewWMS function
    // update the WMS call for that layer
    Object.keys(wmsGroundOverlay).map(function(layer){
      fetchNewWMS({
        layer: layer,
        mapScope: mapScope
      })
    });
  });

  map.addListener('click', catchMapClick);

  //returns the map
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

function getImageBounds(bbox){
  var bboxArr = bbox.split(',');
  var imageBounds = creatGoogleLatLngBounds(
                      parseFloat(bboxArr[0]),
                      parseFloat(bboxArr[1]),
                      parseFloat(bboxArr[2]),
                      parseFloat(bboxArr[3])
  );
  return imageBounds;
}

// var currentZoom = mapScope.getZoom();
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

//helper for building google lat lng bounds objectfrom a set of lat long coordinates
//coordinate order corresponds to min X, min Y, max X, max Y
function creatGoogleLatLngBounds(SWLng, SWLat, NELng, NELat){
  return new google.maps.LatLngBounds(
      new google.maps.LatLng(SWLat, SWLng),
      new google.maps.LatLng(NELat, NELng)
    );
}

// builds out the custom wms url
function buildWMSUrl(layer, bbox){
  var url = "http://localhost:8080/geoserver/hubzone-test/wms?service=WMS";
  url += "&REQUEST=GetMap"; 
  url += "&SERVICE=WMS";    
  url += "&VERSION=1.1.0";    
  url += "&LAYERS=" + "hubzone-test:" + layer; 
  url += "&FORMAT=image/png" ; 
  url += "&TRANSPARENT=TRUE";
  url += "&SRS=EPSG:4326";      
  url += "&BBOX=" + bbox;
  url += "&WIDTH=" + $('#map').width();         
  url += "&HEIGHT=" + $('#map').height();
  return url;             
}

function fetchNewWMS(options){
  //get the map extents
  var bbox = getBbox(options.mapScope);
  var imageBounds = getImageBounds(bbox);

  var layer = options.layer;
  var url = buildWMSUrl(layer, bbox, false);
  url += ('&SLD_BODY=' + xml_styles[layer]);

  //push a new groundOverlay into the wmsGroundOverlay array container
  wmsGroundOverlay[layer].push(new google.maps.GroundOverlay(
      url,
      imageBounds
  ));

  if (wmsGroundOverlay[layer].length === 1){
    wmsGroundOverlay[layer][0].setMap(options.mapScope);
  } else if (wmsGroundOverlay[layer].length === 2){
    wmsGroundOverlay[layer][1].setMap(options.mapScope);
    wmsGroundOverlay[layer][0].setMap(null);
    wmsGroundOverlay[layer].shift();
  }
  wmsGroundOverlay[layer][0].addListener('click', catchMapClick);
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

//jump to location on the map based on the geocode viewport object
/* exported jumpToLocation */
function jumpToLocation(geocodeLocation){
  if (geocodeLocation.viewport){
    var newBounds = creatGoogleLatLngBounds(
                      geocodeLocation.viewport.southwest.lng,
                      geocodeLocation.viewport.southwest.lat,
                      geocodeLocation.viewport.northeast.lng,
                      geocodeLocation.viewport.northeast.lat
      );
    mapScope.fitBounds(newBounds);
  }
}

var hz_current_sld = (
   '<?xml version="1.0" encoding="UTF-8"?>' +
   '<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
   '<sld:NamedLayer>' +
   '<sld:Name>hubzone-test:hz_current</sld:Name>' +
   '<sld:UserStyle>' +
   '<sld:FeatureTypeStyle>' +
   '<sld:Rule>' +
   '<sld:PolygonSymbolizer>' +
   '<sld:Fill>' +
   '<sld:CssParameter name="fill">#377EB8</sld:CssParameter>' +
   '<sld:CssParameter name="fill-opacity">0.75</sld:CssParameter>' +
   '</sld:Fill>' +
   '<sld:Stroke>' +
   '<sld:CssParameter name="stroke">#377EB8</sld:CssParameter>' +
   '<sld:CssParameter name="stroke-width">1.25</sld:CssParameter>' +
   '<sld:CssParameter name="stroke-opacity">1</sld:CssParameter>' +
   '</sld:Stroke>' +
   '</sld:PolygonSymbolizer>' +
   '</sld:Rule>' +
   '</sld:FeatureTypeStyle>' +
   '</sld:UserStyle>' +
   '</sld:NamedLayer>' +
   '</sld:StyledLayerDescriptor>'
);

var indian_lands_sld = (
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
  '<sld:NamedLayer>' +
  '<sld:Name>hubzone-test:indian_lands</sld:Name>' +
  '<sld:UserStyle>' +
  '<sld:FeatureTypeStyle>' +
  '<sld:Rule>' +
  '<sld:PolygonSymbolizer>' +
  '<sld:Fill>' +
  '<sld:GraphicFill>' +
  '<sld:Graphic>' +
  '<sld:Mark>' +
  '<sld:WellKnownName>shape://backslash</sld:WellKnownName>' +
  '<sld:Stroke>' +
  '<sld:CssParameter name="stroke">#663399</sld:CssParameter>' +
  '</sld:Stroke>' +
  '</sld:Mark>' +
  '<sld:Size>16</sld:Size>' +
  '</sld:Graphic>' +
  '</sld:GraphicFill>' +
  '</sld:Fill>' +
  '</sld:PolygonSymbolizer>' +
  '</sld:Rule>' +
  '</sld:FeatureTypeStyle>' +
  '</sld:UserStyle>' +
  '</sld:NamedLayer>' +
  '</sld:StyledLayerDescriptor>'
);

var xml_styles = {
  hz_current: encodeURIComponent(hz_current_sld),
  indian_lands: encodeURIComponent(indian_lands_sld)
}



