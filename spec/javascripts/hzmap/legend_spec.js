//= require hzmap
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


        
