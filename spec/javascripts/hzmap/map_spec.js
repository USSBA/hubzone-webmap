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

  it("get url", function() {
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

var mockFeaturesToRemove = [1805758];

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
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72ac",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803, 39.704982],
              [-95.713734, 39.704843],
              [-95.71379, 39.697069],
              [-95.727995, 39.69713],
              [-95.72803, 39.704982]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 583,
        "objectid": 583,
        "id": 1805772,
        "indian": "2036730",
        "state": "20",
        "census": "204910R",
        "gnis": 2418987,
        "name": "Kickapoo (KS) Reservation/Sac and Fox Nation Trust Land KS",
        "type": "Joint Use Area",
        "class": "American Indian Joint Use Area",
        "recognitio": "Federal",
        "land_area": 0.41,
        "water_area": 0E-11,
        "shape_leng": 0.0441588632638,
        "shape_area": 0.000111364030592
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72ab",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803, 39.704982],
              [-95.728027, 39.824793],
              [-95.503444, 39.825089],
              [-95.72803, 39.704982]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 584,
        "objectid": 584,
        "id": 1805788,
        "indian": "2036725",
        "state": "20",
        "census": "201770R",
        "gnis": 479833,
        "name": "Kickapoo (KS) KS",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 236.27,
        "water_area": 0.56,
        "shape_leng": 1.06045556867,
        "shape_area": 0.0643971748122
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72aa",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.942545,  39.37525],
              [-95.942143, 39.420822],
              [-95.738544, 39.422111],
              [-95.738336, 39.260006],
              [-95.942477, 39.260081],
              [-95.942545,  39.37525]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 582,
        "objectid": 582,
        "id": 1805758,
        "indian": "2057458",
        "state": "20",
        "census": "202980R",
        "gnis": 1934332,
        "name": "Prairie Band of Potawatomi Nation KS",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 121.51,
        "water_area": 0.07,
        "shape_leng": 0.730793469679,
        "shape_area": 0.0328984830648
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
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a6",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803, 39.704982],
              [-95.713734, 39.704843],
              [-95.71379, 39.697069],
              [-95.727995, 39.69713],
              [-95.72803, 39.704982]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 583,
        "objectid": 583,
        "id": 1805772,
        "indian": "2036730",
        "state": "20",
        "census": "204910R",
        "gnis": 2418987,
        "name": "Kickapoo (KS) Reservation/Sac and Fox Nation Trust Land KS",
        "type": "Joint Use Area",
        "class": "American Indian Joint Use Area",
        "recognitio": "Federal",
        "land_area": 0.41,
        "water_area": 0E-11,
        "shape_leng": 0.0441588632638,
        "shape_area": 0.000111364030592
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a5",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.72803, 39.704982],
              [-95.728027, 39.824793],
              [-95.503444, 39.825089],
              [-95.72803, 39.704982]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 584,
        "objectid": 584,
        "id": 1805788,
        "indian": "2036725",
        "state": "20",
        "census": "201770R",
        "gnis": 479833,
        "name": "Kickapoo (KS) KS",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 236.27,
        "water_area": 0.56,
        "shape_leng": 1.06045556867,
        "shape_area": 0.0643971748122
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a4",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.45391, 40.008235],
              [-95.46307, 40.000016],
              [-95.44937, 40.011271],
              [-95.45391, 40.008235]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 586,
        "objectid": 586,
        "id": 1805819,
        "indian": "3142900",
        "state": "31",
        "census": "313285R",
        "gnis": 479832,
        "name": "Sac and Fox Nation NE",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 23.05,
        "water_area": 0E-11,
        "shape_leng": 0.443691859806,
        "shape_area": 0.00421480353154
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a3",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.455283, 40.000307],
              [-95.45304, 39.997518],
              [-95.435991, 40.000207],
              [-95.46307, 40.000016],
              [-95.455283, 40.000307]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 587,
        "objectid": 587,
        "id": 1805836,
        "indian": "2034462",
        "state": "20",
        "census": "201590R",
        "gnis": 479831,
        "name": "Iowa (KS-NE) KS",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 19.65,
        "water_area": 0.01,
        "shape_leng": 0.393161846792,
        "shape_area": 0.00372403038768
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a2",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.46307, 40.000016],
              [-95.468492, 39.996478],
              [-95.565376, 40.000241],
              [-95.46307, 40.000016]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 585,
        "objectid": 585,
        "id": 1805803,
        "indian": "2062037",
        "state": "20",
        "census": "203285R",
        "gnis": 479832,
        "name": "Sac and Fox Nation KS",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 23.05,
        "water_area": 0E-11,
        "shape_leng": 0.288600317928,
        "shape_area": 0.00208166256094
      }
    },
    {
      "type": "Feature",
      "id": "indian_lands_lowestres.fid--34385219_15831175b90_-72a1",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-95.435991, 40.000207],
              [-95.438506, 40.00022],
              [-95.436988, 40.005926],
              [-95.435173, 40.003801],
              [-95.435991, 40.000207]
            ]
          ]
        ]
      },
      "geometry_name": "geom",
      "properties": {
        "gid": 588,
        "objectid": 588,
        "id": 1805859,
        "indian": "3124160",
        "state": "31",
        "census": "311590R",
        "gnis": 479831,
        "name": "Iowa (KS-NE) NE",
        "type": "Reservation",
        "class": "American Indian Area (Reservation Only)",
        "recognitio": "Federal",
        "land_area": 19.65,
        "water_area": 0.01,
        "shape_leng": 0.279541462012,
        "shape_area": 0.00164379498159
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

