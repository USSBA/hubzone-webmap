//= require hzmap
//= require ../helpers/sinon-1.17.6

var google = {
  maps : {
    Animation: {},
    BicyclingLayer: function() {},
    Circle: function () {},
    ControlPosition: {
      TOP_RIGHT: {}
    },
    Data: function() {},
    DirectionsRenderer: function() {},
    DirectionsService: function() {},
    DirectionsStatus: {},
    DirectionsTravelMode: {},
    DirectionsUnitSystem: {},
    DistanceMatrixElementStatus: {},
    DistanceMatrixService: function() {},
    DistanceMatrixStatus: {},
    ElevationService: function() {},
    ElevationStatus: {},
    FusionTablesLayer: function() {},
    Geocoder: function() {},
    GeocoderLocationType: {},
    GeocoderStatus: {},
    GroundOverlay: function() {},
    ImageMapType: function () {},
    InfoWindow: function() {},
    KmlLayer: function() {},
    KmlLayerStatus: {},
    LatLng: function() {},
    LatLngBounds: function() {},
    MVCArray: function() {},
    MVCObject: function() {},
    Map: function () {
        return {
            setTilt: function () { },
            mapTypes: {
                set: function () { }
            },
            overlayMapTypes: {
                insertAt: function () { },
                removeAt: function () { }
            }
        };
    },
    MapTypeControlStyle: {},
    MapTypeId: {
        HYBRID: '',
        ROADMAP: '',
        SATELLITE: '',
        TERRAIN: ''
    },
    MapTypeRegistry: function() {},
    Marker: function() {},
    MarkerImage: function() {},
    MaxZoomService: function () {
        return {
            getMaxZoomAtLatLng: function () { }
        };
    },
    MaxZoomStatus: {},
    NavigationControlStyle: {},
    OverlayView: function () { },
    Point: function() {},
    Polygon: function() {},
    Polyline: function() {},
    Rectangle: function() {},
    SaveWidget: function() {},
    ScaleControlStyle: {},
    Size: function() {},
    StreetViewCoverageLayer: function() {},
    StreetViewPanorama: function() {},
    StreetViewService: function() {},
    StreetViewStatus: {},
    StrokePosition: {},
    StyledMapType: function() {},
    SymbolPath: {},
    TrafficLayer: function() {},
    TransitLayer: function() {},
    TransitMode: {},
    TransitRoutePreference: {},
    TravelMode: {},
    UnitSystem: {},
    ZoomControlStyle: {},
    __gjsload__: function () { },
    event: {
        addListener: function () { }
    },
    places: {
        AutocompleteService: function () {
            return {
                getPlacePredictions: function () { }
            };
        }
    }
  }
};

var coordinates = {
  north: 36.00264017338637,
  east: -96.64306640625,
  south: 34.99419475828389,
  west: -98.35693359375
}

var Marker = {
  setMap: function(map){
    return map;
  }
};

var mapScope = {
  fitBounds: function(){
    return
  },
  getBounds: function() {
    return {
      getNorthEast: function() {
        return {
          lat: function() {
            return coordinates.north
          },
          lng: function() {
            return coordinates.east
          }
        };
      },
      getSouthWest: function() {
        return {
          lat: function() {
            return coordinates.south
          },
          lng: function() {
            return coordinates.west
          }
        };
      }
    };
  },
  data: {
    style: function() {},
    setStyle: function(styleFunction) {
      mapScope.data.style = styleFunction;
    }

  }
};
var mapBounds = mapScope.getBounds();

var map = {
  addListener: function() {},
  data: {
    addListener: function() {}
  },
  mapTypes: {
    set: function(){
      return;
    }
  },
  setMapTypeId: function(){
    return;
  }
};

var mapClick = {
  latLng: {
    lat: function(){
      return markerLocation.lat;
    },
    lng: function(){
      return markerLocation.lng;
    }
  }
};

var mapMarkers = [ Marker]

var mockFeaturesToRemove = ['hz_current_lowestres.601'];

var markerLocation = {
  lat: 39.29024048029149,
  lng: -76.60564721970849
};

var geocodeLocation = {
  location: markerLocation,
  viewport: {
    northeast: {
      lat: 39.29024048029149,
      lng: -76.60564721970849
    },
    southwest: {
      lat: 39.2875425197085,
      lng: -76.6083451802915
    }
  }
};


describe ('Testing map operations', function() {
  beforeEach(function() {
    var constructorSpy = spyOn(google.maps, 'Map').and.returnValue(map);
    var eventSpy = spyOn(google.maps.event, 'addListener');
    var mapListenerSpy = spyOn(map, 'addListener');
    var mapDataListenerSpy = spyOn(map.data, 'addListener');


    var mapScopeSpy = spyOn(mapScope, 'getBounds').and.returnValue(mapBounds);
    var northEastSpy = spyOn(mapBounds, 'getNorthEast').and.callThrough();
    var southWestSpy = spyOn(mapBounds, 'getSouthWest').and.callThrough();
  });

  it("should create a new Google map", function() {
    var styledMapTypeSpy = spyOn(google.maps, 'StyledMapType');
    var mapTypesSetSpy = spyOn(map.mapTypes, 'set');
    var mapSetMapTypIdSpy = spyOn(map, 'setMapTypeId');

    expect(initMap()).not.toBe(null);
    expect(google.maps.Map.calls.count()).toEqual(1);
    expect(google.maps.event.addListener.calls.count()).toEqual(1);
    expect(map.addListener.calls.count()).toEqual(1);
    expect(map.data.addListener.calls.count()).toEqual(1);
    expect(google.maps.StyledMapType.calls.count()).toEqual(1);
    expect(map.mapTypes.set.calls.count()).toEqual(1);
    expect(map.setMapTypeId.calls.count()).toEqual(1);
  });

  it("should get bbox", function() {
    expect(getBbox(mapScope)).toEqual("-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637");
    expect(mapScope.getBounds.calls.count()).toEqual(1);
    expect(mapBounds.getNorthEast.calls.count()).toEqual(2);
    expect(mapBounds.getSouthWest.calls.count()).toEqual(2);
  });

  it("should get the current table based on zoom level", function (){
    expect(getTableBasedOnZoomLevel(13)).toEqual(geomWFSSettings.tableHighRes);
    expect(getTableBasedOnZoomLevel(10)).toEqual(geomWFSSettings.tableLowRes);
    expect(getTableBasedOnZoomLevel(6)).toEqual(geomWFSSettings.tableLowerRes);
    expect(getTableBasedOnZoomLevel(5)).toEqual(geomWFSSettings.tableLowestRes);
  });

  it("should set the map style", function() {
    mapScope.data.setStyle(defaultMapStyle);
    expect(mapScope.data.style).toEqual(defaultMapStyle);
  });

  it("should update the map", function(){
    sinon.stub(jQuery, "ajax");
    var bbox = getBbox(mapScope);
    var url = getUrl(bbox);
    updateMap({
      mapScope: mapScope,
      url: url
    }, sinon.spy());

    expect(jQuery.ajax.calledWithMatch({url: url})).toBe(true);
  });

  it("should create a new MapGeoJson class object and add data", function(){
    var mapGeoJson = new MapGeoJson();
    var diffFeatures = mapGeoJson.diffData(mockData1);
    expect(diffFeatures.toAdd.fc).toEqual(mockData1);
  });

  it("should produce the correct diff between two datasets", function(){
    var mapGeoJson = new MapGeoJson();
    mapGeoJson.mapScope = mapScope;
    var diffFeatures = {};
    diffFeatures = mapGeoJson.diffData(mockData1);
    diffFeatures = mapGeoJson.diffData(mockData2);
    expect(diffFeatures.toRemove.ids).toEqual(mockFeaturesToRemove);
  });

  it("should empty the currentFeatures state", function(){
    var mapGeoJson = new MapGeoJson();
    mapGeoJson.mapScope = mapScope;
    var diffFeatures = {};
    diffFeatures = mapGeoJson.diffData(mockData1);
    mapGeoJson.emptyCurrentFeatures();
    expect(mapGeoJson.currentFeatures.ids.length).toEqual(0);
  });

  it("should parse a viewport to LatLngBounds and send it to fitBounds", function(){
    var latLngBoundsSpy = spyOn(google.maps, 'LatLngBounds');
    var latLngSpy = spyOn(google.maps, 'LatLng');
    var fitBoundsSpy = spyOn(mapScope, 'fitBounds');

    jumpToLocation(geocodeLocation);
    expect(google.maps.LatLngBounds.calls.count()).toEqual(1);
    expect(google.maps.LatLng.calls.count()).toEqual(2);
    expect(mapScope.fitBounds.calls.count()).toEqual(1);
  });

  it("should add a marker object", function(){
    //this code touches all 3 marker functions (updateMarkers, setMapOnAll, clearMarkers)
    var markerSpy = spyOn(google.maps, 'Marker');
    var markerSetSpy = spyOn(Marker, 'setMap');

    updateMarkers(markerLocation);
    expect(google.maps.Marker.calls.count()).toEqual(1);
    expect(Marker.setMap.calls.count()).toEqual(1);
    expect(mapMarkers[0]).not.toEqual(Marker);  //because the test replaces it with a new spy from google.maps.Marker
  });

  it("should empty the  marker object", function(){
    //this code touches all 3 marker functions (updateMarkers, setMapOnAll, clearMarkers)
    var markerSpy = spyOn(google.maps, 'Marker');
    var markerSetSpy = spyOn(Marker, 'setMap');

    updateMarkers();
    expect(mapMarkers.length).toEqual(0); 
  });

  it("should return a correctly formatted url request on map click", function(){
    var latlngUrl = '/search?latlng=' + mapClick.latLng.lat() + ',' + mapClick.latLng.lng();
    var clickUrl = catchMapClick(mapClick);
    expect(clickUrl).toEqual(latlngUrl);  
  });

});




var mockData1 = {
  "type": "FeatureCollection",
  "totalFeatures": 3,
  "features": [
    {
      "type": "Feature",
      "id": "hz_current_lowestres.114",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.713734, 39.704843],
              [-95.71379, 39.697069],
              [-95.727995, 39.69713],
              [-95.72803, 39.704982 ]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 583,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.115",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.728027, 39.824793],
              [-95.503444, 39.825089],
              [-95.503249, 39.507281],
              [-95.728189, 39.568686],
              [-95.727995, 39.69713],
              [-95.71379, 39.697069],
              [-95.713734, 39.704843],
              [-95.72803, 39.704982 ]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 584,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.601",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.942545,39.37525],
              [-95.942143, 39.420822],
              [-95.738544, 39.422111],
              [-95.738336, 39.260006],
              [-95.942477, 39.260081],
              [-95.942545, 39.37525 ]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 582,
        "hztype": "indianLands"
      }
    }
  ],
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::4326"
    }
  }
};

var mockData2 = {
  "type": "FeatureCollection",
  "totalFeatures": 6,
  "features": [
    {
      "type": "Feature",
      "id": "hz_current_lowestres.114",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803,39.704982],
              [95.713734,39.704843],
              [-95.71379,39.697069],
              [-95.727995,39.69713]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 583,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.115",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803,39.704982],
              [95.728027,39.824793],
              [95.503444,39.825089],
              [95.503249,39.507281],
              [95.728189,39.568686],
              [-95.727995, 39.69713],
              [-95.71379,39.697069],
              [95.713734,39.704843]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 584,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.585",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.45391,40.008235],
              [-95.46307,40.000016],
              [95.565376,40.000241],
              [95.565737,40.002496],
              [95.569048,40.003243]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 586,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.586",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [95.455283,40.000307],
              [-95.45304,39.997518],
              [95.435991,40.000207],
              [95.472935,39.994356]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 587,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.602",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.46307,40.000016],
              [95.468492,39.996478],
              [95.466714,39.995939],
              [95.467085,39.994557]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 585,
        "hztype": "indianLands"
      }
    },
    {
      "type": "Feature",
      "id": "hz_current_lowestres.603",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.46307,40.000016],
              [95.468492,39.996478],
              [95.466714,39.995939],
              [95.467085,39.994557]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "res": "high",
        "sourceid": 588,
        "hztype": "indianLands"
      }
    }
  ],
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::4326"
    }
  }
};
