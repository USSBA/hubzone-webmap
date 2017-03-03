//= require hzmap/wmts-utils
//= require hzmap/layer-defs
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing wmts operations', function() {
  beforeEach(function(){
    coords = {x:18, y:24};
    zoom = 6;
    layer = 'indian_lands';
  });

  describe('math!', function(){
    it ('should convert degrees to radians', function(){
      var angle = 180;
      var rads = HZApp.WMTSUtils.toRadians(angle);
      expect(rads).toEqual(angle * Math.PI / 180.0);
    });

    it ('should convert radians to degrees', function(){
      var angle = Math.PI;
      var degrees = HZApp.WMTSUtils.toDegrees(angle);
      expect(degrees).toEqual(angle * 180.0 / Math.PI);
    });  

  });

  describe('should initialize creation of tiles per layer', function(){
    beforeEach(function(){
      google = HZSpecHelper.google;
      HZApp.map = new google.maps.Map();
    });

    afterEach(function(){
      HZApp.map = {};
    });

    it ('should build the tiles when wms is enabled', function(){
      HZApp.config.wmsEnabled = true;
      spyOn(HZApp.WMTSUtils, 'addLayerTiles');
      HZApp.WMTSUtils.initializeTiles();
      expect(HZApp.WMTSUtils.addLayerTiles.calls.count()).toEqual(Object.keys(HZApp.Layers.LayerDefs.hzWMSOverlays).length);
    });

    it ('should do nothin when wms is disabled', function(){
      HZApp.config.wmsEnabled = false;
      spyOn(HZApp.WMTSUtils, 'addLayerTiles');
      HZApp.WMTSUtils.initializeTiles();
      expect(HZApp.WMTSUtils.addLayerTiles.calls.count()).toEqual(0);
    });

    it ('should add tile layers per layer', function(){
      spyOn(google.maps, 'ImageMapType').and.callThrough();
      spyOn(HZApp.map.overlayMapTypes, 'insertAt');
      HZApp.WMTSUtils.addLayerTiles(layer, 0);

      expect(google.maps.ImageMapType.calls.count()).toEqual(1);
      expect(HZApp.map.overlayMapTypes.insertAt.calls.count()).toEqual(1);
      expect(HZApp.Layers.LayerDefs.hzWMSOverlays[layer].overlay).not.toBe(null);
      
      var url  = google.maps.ImageMapType.calls.allArgs()[0][0].getTileUrl(coords, zoom);
      expect(url.includes(layer));
      expect(url.includes(HZApp.WMTSUtils.tile2Bbox(coords.x, coords.y, zoom))).toBe(true);
    });

  });

  describe('getting map coordinates from tile coordinates', function(){
    
    it ('should convert a tile x to a longitude', function(){
      var lng = HZApp.WMTSUtils.tile2Lng(coords.x, zoom);
      expect(lng).toEqual((coords.x / Math.pow(2.0, zoom) * 360.0 - 180));
    });

    it ('should convert a tile y to a latitude', function(){
      var lat = HZApp.WMTSUtils.tile2Lat(coords.y, zoom);
      var n = Math.PI - (2.0 * Math.PI * coords.y) / Math.pow(2.0, zoom);
      var latExp = HZApp.WMTSUtils.toDegrees(Math.atan(Math.sinh(n)));
      expect(lat).toEqual(latExp);
    });

    it ('should convert a lat lng to google web mercator', function(){
      var lat = 36;
      var lng = -79;
      var webMerc = HZApp.WMTSUtils.toWebMercator(lng, lat);
      var expected = [-8794239.772668611, 4300621.372044271];
      expect(webMerc).toEqual(expected);
    });

    it ('should not convert bad lat lng', function(){
      var lat = 92;
      var lng = 181;
      var webMerc = HZApp.WMTSUtils.toWebMercator(lng, lat);
      var expected = [];
      expect(webMerc).toEqual(expected);
    });

    it ('should convert tile coordinates to bbox', function(){
      var bbox = HZApp.WMTSUtils.tile2Bbox(coords.x, coords.y, zoom);
      var expected = "-8766409.899970293,4383204.949985146,-8140237.76425813,5009377.085697311";
      expect(bbox).toEqual(expected);
    });

    it ('should build the correct url', function(){
      spyOn(HZApp.WMTSUtils, 'tile2Bbox').and.callThrough();
      url = HZApp.WMTSUtils.buildTileUrl(coords, zoom, layer);
      expect(HZApp.WMTSUtils.tile2Bbox.calls.count()).toEqual(1);
      expect(url.includes(layer)).toBe(true);
      expect(url.includes(HZApp.WMTSUtils.tile2Bbox(coords.x, coords.y, zoom))).toBe(true);
    });

  });

  describe("handle adding and catching map clicks", function(){

    it("should add listeners for clicks", function() {
      var mockOverlayNew = new HZSpecHelper.NewOverlay('new');
      spyOn(mockOverlayNew, 'addListener');

      HZApp.WMTSUtils.addClickListeners(mockOverlayNew);

      var clickArgs = mockOverlayNew.addListener.calls.allArgs();
      expect(clickArgs[0][0]).toEqual('click');
      expect(clickArgs[1][0]).toEqual('dblclick');
      expect(mockOverlayNew.addListener.calls.count()).toEqual(2);
    });
    
    it("should handle single-click", function() {
      var mapClick = {
        latLng: {
          lat: function(){
            return HZSpecHelper.markerLocation.lat;
          },
          lng: function(){
            return HZSpecHelper.markerLocation.lng;
          }
        }
      };
      spyOn(HZApp.MapUtils, 'catchMapClick');
      spyOn(window, 'setTimeout').and.callFake(function(fn){
        fn.apply(null, arguments);
        return;
      });
      HZApp.WMTSUtils.handleSingleClick(mapClick);
      expect(HZApp.MapUtils.catchMapClick.calls.count()).toEqual(1);
      expect(window.setTimeout.calls.count()).toEqual(1);
    });

    it("should handle double-click", function() {
      var mapClick = {
        latLng: {
          lat: function(){
            return HZSpecHelper.markerLocation.lat;
          },
          lng: function(){
            return HZSpecHelper.markerLocation.lng;
          }
        }
      };
      spyOn(HZApp.MapUtils, 'catchMapClick');
      spyOn(window, 'setTimeout').and.callFake(function(fn){
        fn.apply(null, arguments);
        return;
      });
      HZApp.WMTSUtils.handleDblClick();
      expect(HZApp.MapUtils.catchMapClick.calls.count()).toEqual(0);
    });
  });
});
