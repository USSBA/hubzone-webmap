/* jshint unused: false */
/* jshint undef: false */

// helper for running hz jasmine tests
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
            overlayMapTypes: {
                insertAt: function () { },
                removeAt: function () { }
            },
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
            },
            getCenter: function() {},
            getZoom: function() {},
            fitBounds: function() {},
            setCenter: function() {},
            setZoom: function() {},
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
      addListener: function () {},
      trigger: function() {}
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

var MapMarker = function(){
  return {
    setMap: function(map){
      return map;
    },
    position: function() {}
  }
};

// var mapMarkers = [ new MapMarker() ];

var markerLocation = {
  lat: 39.29024048029149,
  lng: -76.60564721970849
};
/////////////////

// helper for new ground overlays
var NewOverlay = function(name){
  return {
    setMap: function(){},
    addListener: function(){},
    name: name
  };
};

//build a dummy sidebar and mapbody
var mockPage = {
  build: function(){
    var mapBodyDiv = document.createElement('div');
    $(mapBodyDiv).addClass('map-body');
    $('body').append(mapBodyDiv);
    $('body').append('<div id="sidebar" class="hidden"></div>');
    var testDiv = document.createElement('div');
    $('#sidebar').append(testDiv);
    $('#sidebar').css('display', 'none');
    var accordion = '<li>' + 
      '<button id="test_button" class="usa-accordion-button" aria-expanded="false" aria-controls="indian_lands">' + 
        'Indian Lands' + 
      '</button>' +
      '<div id="indian_lands" class="usa-accordion-content" aria-hidden="true">' +
        '<p>' +
        '</p><table class="usa-table-borderless hubzone-qualification-details">' +
        '<tbody>' +
          '<tr>' +
            '<th scope="row">Expires</th>' +
            '<td></td>' +
          '</tr>' +
          '</tbody>' +
        '</table' +
        '<p></p>' +
      '</div>' + 
    '</li>';
    $(testDiv).append(accordion);
    sidebar = $('#sidebar').sidebar();
    updateAccordions();
    return sidebar;
  },
  destroy: function(){
    sidebar = {};
    $('#sidebar').remove();
    $('.map-body').remove();
  }
}
