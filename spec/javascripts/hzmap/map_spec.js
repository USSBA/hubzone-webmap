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

describe ('Testing map operations', function() {
  beforeEach(function() {
    var constructorSpy = spyOn(google.maps, 'Map').and.returnValue(['Map', 'map']);
    var eventSpy = spyOn(google.maps.event, 'addListener');

    var mapScopeSpy = spyOn(mapScope, 'getBounds').and.returnValue(mapBounds);
    var northEastSpy = spyOn(mapBounds, 'getNorthEast').and.callThrough();
    var southWestSpy = spyOn(mapBounds, 'getSouthWest').and.callThrough();
  });

  // afterEach(function(){
  //   jQuery.ajax.restore();

  // });

  it("creates a new Google map", function() {
    expect(initMap()).not.toBe(null);
    expect(google.maps.Map).toHaveBeenCalledTimes(1);
    expect(google.maps.event.addListener).toHaveBeenCalledTimes(1);
  });

  it("get bbox", function() {
    expect(getBbox(mapScope)).toEqual("-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637");
    expect(mapScope.getBounds).toHaveBeenCalledTimes(1);
    expect(mapBounds.getNorthEast).toHaveBeenCalledTimes(2);
    expect(mapBounds.getSouthWest).toHaveBeenCalledTimes(2);
  });

  xit("get url", function() {
    // skipping this since it is implicitly being tested by the "updates the map" test
    var bbox = getBbox(mapScope);
    expect(getUrl(bbox)).toEqual("http://localhost:8080/geoserver/hubzone-test/ows?service=WFS&version=1.0.0&request=GetFeature&typename=hzgeo_dev:indian_lands&outputFormat=application/json&srsname=EPSG:4326&bbox=-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637,EPSG:4326");
  });

  it("sets the map style", function() {
    mapScope.data.setStyle(defaultMapStyle);
    expect(mapScope.data.style).toEqual(defaultMapStyle);
  });

  it("updates the map", function(){
    sinon.stub(jQuery, "ajax");
    var bbox = getBbox(mapScope);
    var url = getUrl(bbox);
    updateMap({
      mapScope: mapScope,
      url: url
    }, sinon.spy());

    expect(jQuery.ajax.calledWithMatch({url: url})).toBe(true);
  });

  it("create a new MapGeoJson class object and add data", function(){
    var mapGeoJson = new MapGeoJson();
    mapGeoJson.diffData(mockData1);
    expect(mapGeoJson.currentFeatures.features).toEqual(mockData1.features);
  });

  it("produce the correct diff between two datasets", function(){
    var mapGeoJson = new MapGeoJson();
    mapGeoJson.uniqueID = 'id';
    mapGeoJson.mapScope = mapScope;
    mapGeoJson.diffData(mockData1);
    mapGeoJson.diffData(mockData2);
    console.log(mapGeoJson);
    expect(mapGeoJson.featuresToRemove).toEqual(mockFeaturesToRemove);
  });

  it("should parse a viewport to LatLngBounds and send it to fitBounds", function(){
    var latLngBoundsSpy = spyOn(google.maps, 'LatLngBounds');
    var latLngSpy = spyOn(google.maps, 'LatLng');
    var fitBoundsSpy = spyOn(mapScope, 'fitBounds');

    jumpToLocation(geocodeViewport);
    expect(google.maps.LatLngBounds).toHaveBeenCalledTimes(1);
    expect(google.maps.LatLng).toHaveBeenCalledTimes(2);
    expect(mapScope.fitBounds).toHaveBeenCalledTimes(1);
  });

  it("should add a marker object", function(){
    //this code touches all 3 marker functions (updateMarkers, setMapOnAll, clearMarkers)
    var markerSpy = spyOn(google.maps, 'Marker');
    var markerSetSpy = spyOn(Marker, 'setMap');

    updateMarkers(markerLocation);
    expect(google.maps.Marker).toHaveBeenCalledTimes(1);
    expect(Marker.setMap).toHaveBeenCalledTimes(1);
    expect(mapMarkers[0]).not.toEqual(Marker);  //because the test replaces it with a new spy from google.maps.Marker
  });


});



////////////////////////////////////////////////////////////////////////////
//  testing data
////////////////////////////////////////////////////////////////////////////

var mapMarkers = [ Marker]

var mockFeaturesToRemove = ['indianLands_582'];

var markerLocation = {  
  lat: 39.29024048029149,  
  lng: -76.60564721970849
};

var geocodeViewport = {
  northeast: {
    lat: 39.29024048029149,
    lng: -76.60564721970849
  },
  southwest: {
    lat: 39.2875425197085,
    lng: -76.6083451802915
  }
};

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
