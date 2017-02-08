/* jshint unused: false */
/* jshint undef: false */

// helper for running hz jasmine tests
var HZSpecHelper = (function(){
  return {
    //build a dummy sidebar and mapbody
    mockPage: {
      build: function(){
        //add map
        var mapBodyDiv = document.createElement('div');
        $(mapBodyDiv).addClass('map-body mock-page');
        $('body').append(mapBodyDiv);

        //add header and search
        $('body').append('<div id="header" class=" mock-page hidden"></div>');
        $('#header').append('<div id="search-field-small" class="mock-page hidden"></div>')

        //add legend
        $('body').append('<div id="legend" class="mock-page"><ul>' +
                          '<li id="legend-header">' +
                            '<span id="legend-header-title" style="display: none;">Legend</span>' +
                            '<div id="legend-button-div">' +
                              '<i id="hide-legend-button" class="fa fa-chevron-down" aria-hidden="true"></i>' +
                              '<i id="show-legend-button" class="fa fa-chevron-up" aria-hidden="true" style="display: none;"></i>' +
                            '</div>' +
                          '</li>' +
                          '<input type="checkbox" id="mock-checkbox" value="mock-qct" checked>' +
                          '</ul></dir>');

        //add geolocation button
        $('body').append('<div id="geolocation" class=" mock-page hidden"></div>');
        $('#geolocation').append('<i class="fa fa-location-arrow" style="display: block;"></i>')
        $('#geolocation').append('<div class="geolocation-loading" style="display: none;"></i>')

        //add sidebar
        $('body').append('<div id="sidebar" class="mock-page hidden"></div>');
        var testDiv = document.createElement('div');
        $('#sidebar').append(testDiv);
        $('#sidebar').css('display', 'none');
        sidebar = $('#sidebar').sidebar();
        return sidebar;
      },
      destroy: function(){
        var mockElements = document.getElementsByClassName('mock-page');
        for (var i = mockElements.length - 1; i >= 0; i--) { //iterate over in reverse order since mockElements is a live list
          mockElements[i].remove();
        }
        sidebar = {};
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
                getCenter: function() {
                  return {
                    lat: function(){
                      return HZSpecHelper.markerLocation.lat;
                    },
                    lng: function(){
                      return HZSpecHelper.markerLocation.lng;
                    }
                  }
                },
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
               addListener: function () { },
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
    testLayers: {
      qnmc_e: {
        legendType: 'qnmc',
        layerGroup: 'qnmc',
        styleOptions: [
          {
            type: 'polygon',
            fillColor: '#00FF00',
          }
        ]
      },
      qct_r: {
        legendType: 'redesignated',
        layerGroup: 'qct',
        styleOptions: [
          {
            type: 'horline',
            lineStrokeColor: '#FF00FF',
          }
        ]
      },
      qnmc_r: {
        legendType: 'redesignated',
        layerGroup: 'qnmc',
        styleOptions: [
          {
            type: 'horline',
            lineStrokeColor: '#FF0000',
          }
        ]
      },
      qnmc_brac: {
        legendType: 'brac',
        layerGroup: 'qnmc',
        styleOptions: [
          {
            type: 'circle',
            circleFillColor: '#0000FF',
          }
        ]
      }
    },
    mockKeyEvent: function(ctrl, meta, key){
      return {
        preventDefault: function(){},
        ctrlKey: ctrl,
        metaKey: meta,
        keyCode: key,
      }
    }
  };
})();
