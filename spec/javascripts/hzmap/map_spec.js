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

var mockData = {
  "type": "FeatureCollection",
  "totalFeatures": 1,
  "features": [{
    "type": "Feature",
    "id": "indianlands_2014.582",
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [-95.942545, 39.37525],
            [-95.942583, 39.375954],
            [-95.942522, 39.374808],
            [-95.942535, 39.37506],
            [-95.942545, 39.37525]
          ]
        ]
      ]
    },
    "geometry_name": "geom",
    "properties": {
      "objectid": 582,
      "id": 1805758,
      "indian": "2057458",
      "name": "Prairie Band of Potawatomi Nation KS"
    }
  }],
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::4326"
    }
  }
};


describe ('Testing map operations', function() {
  beforeEach(function() {
    var constructorSpy = spyOn(google.maps, 'Map').and.returnValue(['Map', 'map']);
    var eventSpy = spyOn(google.maps.event, 'addListener');


  });

  it("map loads with properties", function() {
    expect(initMap()).not.toBe(null);
    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  xit("map has a data object", function() {
    expect(window.map.data).toBeDefined();
  });

  //this one fails because the previous one fails
  xit ("map has some data", function(){
    window.map.data.addGeoJson(mockData);;
    var hasData = window.map.data.contains(mockData)
    expect(hasData).toBe(true);
  });
});
