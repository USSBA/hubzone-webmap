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
    Object.keys(HZApp.Layers.hzWMSOverlays).map(function(layer){
      HZApp.Layers.hzWMSOverlays[layer].overlay = [];
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
  }
};
