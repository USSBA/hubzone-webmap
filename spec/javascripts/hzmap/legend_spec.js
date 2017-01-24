//= require hzmap/legend
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing legend operations', function() {
  beforeEach(function(){
    testLayers = HZSpecHelper.testLayers;
  });

  afterEach(function(){
  });

  describe ('Testing svg creators', function() {
    it("should make the correct svg header", function(){
      var width = 10, height = 11;
      var svgHeaderStr = HZApp.Legend.svgHeader(width, height);
      expect($(svgHeaderStr).attr('width')).toEqual(width + 'px');
      expect($(svgHeaderStr).attr('height')).toEqual(height + 'px');
      expect($(svgHeaderStr)[0].getAttribute('viewBox')).toEqual('0 0 ' + (width+5) + ' ' + height);
    });

    it("should make the correct polygon svg", function(){
      var width = 10, height = 11;
      var style = {
        styleColor: '#00FF00'
      };

      var svgPolyStr = HZApp.Legend.svg_polygon(style, width, height);
      expect(parseInt($(svgPolyStr).find('rect').attr('width'))).toEqual(width);
      expect(parseInt($(svgPolyStr).find('rect').attr('height'))).toEqual(height);
      expect($(svgPolyStr).attr('fill')).toEqual(style.styleColor);
    });


  });

  describe ('Testing legend style object utilities', function() {

    it("should run the getConfigFromLayerStyle method on each layer", function(){
      spyOn(HZApp.Legend, 'getConfigFromLayerStyle').and.callThrough();

      HZApp.Legend.buildLegend(testLayers);
      expect(HZApp.Legend.getConfigFromLayerStyle.calls.count()).toEqual(Object.keys(testLayers).length);
    });

    it("should parse the layer config into a legendConfig", function(){
      var layer = testLayers['qnmc_e'];
      var legendConfig = HZApp.Legend.getConfigFromLayerStyle(layer);
      expect(legendConfig.legendType).toEqual(layer.legendType);
      expect(legendConfig.styleType).toEqual(layer.styleOptions[0].type);
      expect(legendConfig.styleColor).toEqual(layer.styleOptions[0][HZApp.Legend.legendTypeToColorType[legendConfig.styleType]]);
    });
  });    

});



        
