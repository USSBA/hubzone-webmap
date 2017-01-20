//= require hzmap
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing layer style operations', function() {
  beforeEach(function(){
  });

  afterEach(function(){
    dummyLayer = {};
  });

  it("should create a polygon PolygonSymbolizer SLD string from an object of parameters", function(){
      layerOptions = {
        layerName: 'qct',
        styles: [
          {
            type: 'polygon',
            fillColor: '#4daf4a',
            fillOpacity: 0.5,
            strokeColor: '#4daf4a',
            strokeWidth: 1.0,
            strokeOpacity: 0.5
          }
        ]
      };

      dummyLayer = new HZApp.Layers.newLayer(layerOptions);
      expect($(dummyLayer.styleRules).find('CssParameter[name="fill"]').text()).toEqual(layerOptions.styles[0].fillColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="fill-opacity"]').text())).toEqual(layerOptions.styles[0].fillOpacity);
      expect($(dummyLayer.styleRules).find('CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].strokeColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].strokeWidth);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].strokeOpacity);
  });

  it("should create a polygon PolygonSymbolizer SLD string with defaults when given nulls", function(){
      layerOptions = {
        layerName: 'qct',
        styles: [
          {
            type: 'polygon'
          }
        ]
      };

      dummyLayer = new HZApp.Layers.newLayer(layerOptions);
      expect($(dummyLayer.styleRules).find('CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.defaults.defaultColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="fill-opacity"]').text())).toEqual(HZApp.Layers.defaults.defaultFillOpacity);
      expect($(dummyLayer.styleRules).find('CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.defaults.defaultColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.defaults.defaultStrokeWidth);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.defaults.defaultStrokeOpacity);
  });

  it("should create a circle PolygonSymbolizer SLD string with defaults when given nulls", function(){
    layerOptions = {
      layerName: 'qct_brac',
      styles: [
        {
          type: 'polygon',
        },
        {
          type: 'circle',
        }
      ]
    };

    dummyLayer = new HZApp.Layers.newLayer(layerOptions);
    
    // test base fill
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.defaults.defaultColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > CssParameter[name="fill-opacity"]').text())).toEqual(HZApp.Layers.defaults.defaultFillOpacity);
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.defaults.defaultColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.defaults.defaultStrokeWidth);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.defaults.defaultStrokeOpacity);
    
    // test for circle properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic Fill CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.defaults.defaultCircleColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(HZApp.Layers.defaults.defaultCircleSize);
  });

  it("should create a circle PolygonSymbolizer SLD string with parameters", function(){
    layerOptions = {
      layerName: 'qct_brac',
      styles: [
        {
          type: 'polygon',
          fillColor: '#4daf4a',
          fillOpacity: 0.5,
          strokeColor: '#4daf4a',
          strokeWidth: 1.0,
          strokeOpacity: 0.5
        },
        {
          type: 'circle',
          fillColor: '#4daf4a',
          fillOpacity: 0.5,
          strokeColor: '#4daf4a',
          strokeWidth: 1.0,
          strokeOpacity: 0.5,
          circleSize: 4
        }
      ]
    };

    dummyLayer = new HZApp.Layers.newLayer(layerOptions);
    
    // test base fill
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > CssParameter[name="fill"]').text()).toEqual(layerOptions.styles[0].fillColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > CssParameter[name="fill-opacity"]').text())).toEqual(layerOptions.styles[0].fillOpacity);
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].strokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].strokeWidth);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].strokeOpacity);
    
    // test for circle properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic Fill CssParameter[name="fill"]').text()).toEqual(layerOptions.styles[1].fillColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(layerOptions.styles[1].circleSize);
  });
});
