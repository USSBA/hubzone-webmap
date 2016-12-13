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
        Autocomplete: function () {
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
};

var mapScope = {
  getBounds: function() {
    return {
      getNorthEast: function() {
        return {
          lat: function() {
            return coordinates.north;
          },
          lng: function() {
            return coordinates.east;
          }
        };
      },
      getSouthWest: function() {
        return {
          lat: function() {
            return coordinates.south;
          },
          lng: function() {
            return coordinates.west;
          }
        };
      }
    };
  }
};
var mapBounds = mapScope.getBounds();

var map = {
  fitBounds: function(){
    return;
  },
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



//////////////////
// Marker Helpers
/////////////////
var Marker = {
  setMap: function(map){
    return map;
  }
};

var mapMarkers = [ Marker ];

var markerLocation = {
  lat: 39.29024048029149,
  lng: -76.60564721970849
};
/////////////////

// helper for new ground overlays
var newOverlay = function(name){
  return {
    setMap: function(){},
    addListener: function(){},
    name: name
  };
};

describe ('Testing map operations', function() {
  beforeEach(function() {
    var constructorSpy = spyOn(google.maps, 'Map').and.returnValue(map);
    var eventSpy = spyOn(google.maps.event, 'addListener');
    var mapListenerSpy = spyOn(map, 'addListener');
  });

  it("should create a new Google map", function() {
    var styledMapTypeSpy = spyOn(google.maps, 'StyledMapType');
    var mapTypesSetSpy = spyOn(map.mapTypes, 'set');
    var mapSetMapTypIdSpy = spyOn(map, 'setMapTypeId');
    var autoComplete = spyOn(google.maps.places, 'Autocomplete');

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM] = [];
    map.controls[google.maps.ControlPosition.TOP_RIGHT] = [];

    expect(initMap()).not.toBe(null);
    expect(google.maps.Map.calls.count()).toEqual(1);
    expect(google.maps.event.addListener.calls.count()).toEqual(1);
    expect(map.addListener.calls.count()).toEqual(1);
    expect(google.maps.StyledMapType.calls.count()).toEqual(1);
    expect(map.mapTypes.set.calls.count()).toEqual(1);
    expect(map.setMapTypeId.calls.count()).toEqual(1);
    expect(google.maps.places.Autocomplete.calls.count()).toEqual(1);
  });

  it("should get bbox", function() {
    var mapScopeSpy = spyOn(mapScope, 'getBounds').and.returnValue(mapBounds);
    var northEastSpy = spyOn(mapBounds, 'getNorthEast').and.callThrough();
    var southWestSpy = spyOn(mapBounds, 'getSouthWest').and.callThrough();

    expect(getBbox(mapScope)).toEqual("-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637");
    expect(mapScope.getBounds.calls.count()).toEqual(1);
    expect(mapBounds.getNorthEast.calls.count()).toEqual(2);
    expect(mapBounds.getSouthWest.calls.count()).toEqual(2);
  });

  it("should return correct imageBounds object", function(){
    var createLatLngSpy = spyOn(window, 'createGoogleLatLngBounds');
    var bboxStr = [coordinates.west, coordinates.south, coordinates.east, coordinates.north].join(',');

    var imageBounds = getImageBounds(bboxStr);
    expect(imageBounds).not.toBe(null);
    expect(window.createGoogleLatLngBounds).toHaveBeenCalled();
  });

  it("should run google latlng methods", function(){
    var latLngBoundsSpy = spyOn(google.maps, 'LatLngBounds');
    var latLngSpy = spyOn(google.maps, 'LatLng');

    createGoogleLatLngBounds(coordinates.west, coordinates.south, coordinates.east, coordinates.north);
    expect(google.maps.LatLngBounds.calls.count()).toEqual(1);
    expect(google.maps.LatLng.calls.count()).toEqual(2);
  });

  xit("should get the current table based on zoom level", function (){
    expect(getTableBasedOnZoomLevel(13)).toEqual(geomWFSSettings.tableHighRes);
    expect(getTableBasedOnZoomLevel(10)).toEqual(geomWFSSettings.tableLowRes);
    expect(getTableBasedOnZoomLevel(6)).toEqual(geomWFSSettings.tableLowerRes);
    expect(getTableBasedOnZoomLevel(5)).toEqual(geomWFSSettings.tableLowestRes);
  });

  it("should build the correct URL", function() {
    var bbox = getBbox(mapScope);
    var layer = 'hz_current';
    var url = buildWMSUrl({
      layer: layer,
      bbox: bbox});
    var urlExpect = 'http://localhost:8080/geoserver/hubzone-test/wms?service=WMS&REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.0&LAYERS=hubzone-test:' + layer + '&FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:4326&BBOX=-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637&WIDTH=null&HEIGHT=null&SLD_BODY=' + xml_styles[layer];
    expect(url).toEqual(urlExpect);
  });


  it("should call the wms map layer stack", function(){
    var bboxSpy = spyOn(window, 'getBbox');
    var imageBoundsSpy = spyOn(window, 'getImageBounds');
    var buildWMSUrlSpy = spyOn(window, 'buildWMSUrl');
    var groundOverlaySpy = spyOn(google.maps, 'GroundOverlay');
    var updateLayerWMSSpy = spyOn(window, 'updateLayerWMSOverlay');

    fetchNewWMS({
      mapScope: mapScope,
      layer: 'hz_current'
    });

    expect(window.getBbox.calls.count()).toEqual(1);
    expect(window.getImageBounds.calls.count()).toEqual(1);
    expect(window.buildWMSUrl.calls.count()).toEqual(1);
    expect(google.maps.GroundOverlay.calls.count()).toEqual(1);
    expect(window.updateLayerWMSOverlay.calls.count()).toEqual(1);
  });

  it("should fetchNewWMS for as many layers as are defined", function(){
    var newfetchSpy = spyOn(window, 'fetchNewWMS');
    updateIdleMap(mapScope);
    var layerLength = Object.keys(wmsGroundOverlay).length;
    expect(window.fetchNewWMS.calls.count()).toEqual(layerLength);
  });

  it("should update the map WMS layer, adding a new overlay where there was none before", function(){

    wmsGroundOverlay.hz_current[0] = new newOverlay();

    var newOverlaySetMapSpy = spyOn(wmsGroundOverlay.hz_current[0], 'setMap');
    var newOverlayListenterSpy = spyOn(wmsGroundOverlay.hz_current[0], 'addListener');

    updateLayerWMSOverlay({
      layer: 'hz_current',
      mapScope: mapScope
    });

    expect(wmsGroundOverlay.hz_current[0].setMap.calls.count()).toEqual(1);
    expect(wmsGroundOverlay.hz_current[0].addListener.calls.count()).toEqual(1);
  });

  it("should update the map WMS layer, replacing the old overlay with a new one", function(){

    wmsGroundOverlay.hz_current[0] = new newOverlay('old');
    wmsGroundOverlay.hz_current[1] = new newOverlay('new');

    var oldOverlaySetMapSpy = spyOn(wmsGroundOverlay.hz_current[0], 'setMap');
    var newOverlaySetMapSpy = spyOn(wmsGroundOverlay.hz_current[1], 'setMap');
    var OvenewrlayListenterSpy = spyOn(wmsGroundOverlay.hz_current[1], 'addListener');

    updateLayerWMSOverlay({
      layer: 'hz_current',
      mapScope: mapScope
    });

    //here the indexing changes because updateLayerWMSOverlay removes the 0'th 'old' layer
    //can be checked by console logging console.log(wmsGroundOverlay[layer][0].name) before and after the function call
    expect(wmsGroundOverlay.hz_current[0].setMap.calls.count()).toEqual(1);
    expect(wmsGroundOverlay.hz_current[0].addListener.calls.count()).toEqual(1);
  });

  it("should handle an empty WMS update call", function(){
    var layer = 'hz_current';
    wmsGroundOverlay[layer] = [];
    var updateState = updateLayerWMSOverlay({
      layer: layer,
      mapScope: mapScope
    });
    expect(updateState).toBe(null);
  });

  it("should parse a viewport to LatLngBounds and send it to fitBounds", function(){
    var latLngBoundsSpy = spyOn(google.maps, 'LatLngBounds');
    var latLngSpy = spyOn(google.maps, 'LatLng');
    var fitBoundsSpy = spyOn(map, 'fitBounds');

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

    jumpToLocation(geocodeLocation);
    expect(google.maps.LatLngBounds.calls.count()).toEqual(1);
    expect(google.maps.LatLng.calls.count()).toEqual(2);
    expect(map.fitBounds.calls.count()).toEqual(1);
  });

  it("should pass over a geocodeLocation that does not contain a viewport, doing nothing", function(){
    var fitBoundsSpy = spyOn(map, 'fitBounds');

    var geocodeLocationNoViewport = {
      location: markerLocation
    };

    jumpToLocation(geocodeLocationNoViewport);
    expect(map.fitBounds.calls.count()).toEqual(0);
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

    var latlngUrl = '/search?latlng=' + mapClick.latLng.lat() + ',' + mapClick.latLng.lng();
    var clickUrl = catchMapClick(mapClick);
    expect(clickUrl).toEqual(latlngUrl);
  });

  // it("should show autocomplete results when a search is started", function(){
  //   var testDivForAutocomplete = document.createElement('pac-test');
  //   $('body').append(testDivForAutocomplete);
  //   var autoCompleteResults = '<div class="pac-container pac-logo" style="width: 500px; position: absolute; left: 260px; top: 145px; display: none;">' +
  //     '<div class="pac-item"><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched">8</span>29</span><span>North Charles Street, Baltimore, MD, United States</span></div>' +
  //     '<div class="pac-item"><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched">8</span>27</span><span>Washington Boulevard, Baltimore, MD, United States</span></div>' +
  //     '<div class="pac-item"><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched">8</span>88</span><span>South Broadway, Baltimore, MD, United States</span></div>' +
  //     '<div class="pac-item"><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched">8</span>20</span><span>Frederick Avenue, Baltimore, MD, United States</span></div>' +
  //     '<div class="pac-item"><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched">8</span>01</span><span>Cherry Hill Road, Baltimore, MD, United States</span></div>' +
  //     '</div>';
  //   $(testDivForAutocomplete).append(autoCompleteResults);
  // });

});
