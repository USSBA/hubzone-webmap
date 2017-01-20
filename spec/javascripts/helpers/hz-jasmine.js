/* jshint unused: false */
/* jshint undef: false */

// helper for running hz jasmine tests
var HZSpecHelper = {

  //build a dummy sidebar and mapbody
  mockPage: {
    build: function(){
      var mapBodyDiv = document.createElement('div');
      $(mapBodyDiv).addClass('map-body');
      $('body').append(mapBodyDiv);
      $('body').append('<div id="header" class="hidden"></div>');
      $('#header').append('<div id="search-field-small" class="hidden"></div>')
      $('body').append('<div id="sidebar" class="hidden"></div>');
      $('body').append('<div id="geolocation" class="hidden"></div>');
      $('#geolocation').append('<i class="fa fa-location-arrow" style="display: block;"></i>')
      $('#geolocation').append('<div class="geolocation-loading" style="display: none;"></i>')
      var testDiv = document.createElement('div');
      $('#sidebar').append(testDiv);
      $('#sidebar').css('display', 'none');
      sidebar = $('#sidebar').sidebar();
      return sidebar;
    },
    destroy: function(){
      sidebar = {};
      $('#sidebar').remove();
      $('.map-body').remove();
      $('#geolocation').remove();
    }
  },
  google: {
    maps : {
      ControlPosition: {
        TOP_RIGHT: [],
        LEFT_BOTTOM: [],
        RIGHT_BOTTOM: []
      },
      GroundOverlay: function(){},
      LatLng: function(){},
      LatLngBounds: function(){},
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
                        return 36.00264017338637;
                      },
                      lng: function() {
                        return -96.64306640625;
                      }
                    };
                  },
                  getSouthWest: function() {
                    return {
                      lat: function() {
                        return 34.99419475828389;
                      },
                      lng: function() {
                        return -98.35693359375;
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
      StyledMapType: function(){},
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
  },
  coordinates: {
    north: 36.00264017338637,
    east: -96.64306640625,
    south: 34.99419475828389,
    west: -98.35693359375
  },
  MapMarker: function(){
    return {
      setMap: function(map){
        return map;
      },
      position: function() {}
    }
  },
  markerLocation: {
    lat: 39.29024048029149,
    lng: -76.60564721970849
  },
  NewOverlay: function(name){
    return {
      setMap: function(){},
      addListener: function(){},
      name: name
    };
  },
  resetOverlays: function(){
    Object.keys(HZApp.Layers.LayerDefs.hzWMSOverlays).map(function(layer){
      HZApp.Layers.LayerDefs.hzWMSOverlays[layer].overlay = [];
    });
  },
  fakeNavLocation: {
    getCurrentPosition: function(){}
  },  
  fakeGeolocation: function(){
    if (navigator.geolocation === null || navigator.geolocation === undefined){
      return null;
    } else {
      return spyOn(navigator.geolocation, 'getCurrentPosition');      
    }
  },
  wmsURLFake: "FORMAT=image/png&TRANSPARENT=TRUE&SRS=EPSG:4326&BBOX=-98.35693359375,34.99419475828389,-96.64306640625,36.00264017338637&WIDTH=0&HEIGHT=0&SLD_BODY=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20version%3D%221.0.0%22%20xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%20StyledLayerDescriptor.xsd%22%3E%3CNamedLayer%3E%3CName%3Ehubzone-test%3Aqct%3C%2FName%3E%3CUserStyle%3E%3CFeatureTypeStyle%3E%3CRule%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CCssParameter%20name%3D%22fill%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22fill-opacity%22%3E0.5%3C%2FCssParameter%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-opacity%22%3E1%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3C%2FFeatureTypeStyle%3E%3C%2FUserStyle%3E%3C%2FNamedLayer%3E%3C%2FStyledLayerDescriptor%3E"
};
