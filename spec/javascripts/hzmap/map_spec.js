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

var mapScope = {
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

    var mapScopeSpy = spyOn(mapScope, 'getBounds').and.returnValue(mapBounds);
    var northEastSpy = spyOn(mapBounds, 'getNorthEast').and.callThrough();
    var southWestSpy = spyOn(mapBounds, 'getSouthWest').and.callThrough();
  });

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
    expect(getUrl(bbox)).toEqual("http://localhost:8080/geoserver/hubzone-test/ows?service=WFS&version=1.0.0&request=GetFeature&typename=hubzone-test:indianlands_2014&outputFormat=application/json&srsname=EPSG:4326&bbox=-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637,EPSG:4326");
  });

  it("sets the map style", function() {
    mapScope.data.setStyle(defaultMapStyle);
    expect(mapScope.data.style).toEqual(defaultMapStyle);
  });
});
