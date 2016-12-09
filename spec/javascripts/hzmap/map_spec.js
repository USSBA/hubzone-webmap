//= require hzmap
//= require ../helpers/sinon-1.17.6

var google = {
  maps : {
    Animation: {},
    BicyclingLayer: function() {},
    Circle: function () {},
    ControlPosition: {
      TOP_RIGHT: [],
      LEFT_BOTTOM: []
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
  },
  controls: []
};
map.controls[google.maps.ControlPosition.LEFT_BOTTOM] = [];
map.controls[google.maps.ControlPosition.TOP_RIGHT] = [];

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

var geocodeLocationNoViewport = {
  location: markerLocation
};

describe ('Testing map operations', function() {
  beforeEach(function() {
    var constructorSpy = spyOn(google.maps, 'Map').and.returnValue(map);
    var eventSpy = spyOn(google.maps.event, 'addListener');
    var mapListenerSpy = spyOn(map, 'addListener');

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

  it("should return correct imageBounds object", function(){
    var latLngBoundsSpy = spyOn(google.maps, 'LatLngBounds');
    var latLngSpy = spyOn(google.maps, 'LatLng');

    var bboxStr = [coordinates.west, coordinates.south, coordinates.east, coordinates.north].join(',');
    var imageBounds = getImageBounds(bboxStr);
    expect(imageBounds).not.toBe(null);
    expect(google.maps.LatLngBounds.calls.count()).toEqual(1);
    expect(google.maps.LatLng.calls.count()).toEqual(2);

  });

  it("should get the current table based on zoom level", function (){
    expect(getTableBasedOnZoomLevel(13)).toEqual(geomWFSSettings.tableHighRes);
    expect(getTableBasedOnZoomLevel(10)).toEqual(geomWFSSettings.tableLowRes);
    expect(getTableBasedOnZoomLevel(6)).toEqual(geomWFSSettings.tableLowerRes);
    expect(getTableBasedOnZoomLevel(5)).toEqual(geomWFSSettings.tableLowestRes);
  });

  it("should build the correct URL", function() {
    var bbox = getBbox(mapScope);
    var url = buildWMSUrl('hz_current', bbox);
    var urlExpect = 'http://localhost:8080/geoserver/hubzone-test/wms?service=WMS&REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.0&LAYERS=hubzone-test:hz_current&FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:4326&BBOX=-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637&WIDTH=null&HEIGHT=null'
    expect(url).toEqual(urlExpect);
  });

  xit("should update the map", function(){
    sinon.stub(jQuery, "ajax");
    var bbox = getBbox(mapScope);
    fetchNewWMS({
      bbox: bbox,
      mapScope: mapScope
    }, sinon.spy());

    expect(jQuery.ajax.calledWithMatch({url: url})).toBe(true);
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

  it("should empty the marker object", function(){
    mapMarkers = [Marker];
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
