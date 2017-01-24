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

      dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
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

      dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
      expect($(dummyLayer.styleRules).find('CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.fillColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="fill-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.fillOpacity);
      expect($(dummyLayer.styleRules).find('CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.strokeColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeWidth);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeOpacity);
  });

  it("should create a circle PolygonSymbolizer SLD string with defaults when given nulls", function(){
    layerOptions = {
      layerName: 'qct_brac',
      styles: [
        {
          type: 'circle',
        }
      ]
    };

    dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
    // test for circle properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Fill > CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.circleFillColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Fill > CssParameter[name="fill-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.circleFillOpacity);

    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.circleStrokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.circleStrokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.circleStrokeWidth);

    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(HZApp.Layers.LayerDefs.defaults.tileSize);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > VendorOption[name="graphic-margin"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.graphicSpacing);
    
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.strokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeWidth);
  });

  it("should create a circle PolygonSymbolizer SLD string with parameters", function(){
    layerOptions = {
      layerName: 'qct_brac',
      styles: [
        {
          type: 'circle',
          circleFillColor: '#4daf4a',
          circleFillOpacity: 0.9,
          circleStrokeColor: '#4daf4a',
          circleStrokeOpacity: 1.0,
          circleStrokeWidth: 1.0,
          strokeColor: '#4daf4a',
          strokeOpacity: 1.0,
          strokeWidth: 1.5,
          tileSize: 15,
          graphicSpacing: 5

        }
      ]
    };

    dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
    
    // test for circle properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Fill > CssParameter[name="fill"]').text()).toEqual(layerOptions.styles[0].circleFillColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Fill > CssParameter[name="fill-opacity"]').text())).toEqual(layerOptions.styles[0].circleFillOpacity);

    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].circleStrokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].circleStrokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].circleStrokeWidth);

    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(layerOptions.styles[0].tileSize);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > VendorOption[name="graphic-margin"]').text())).toEqual(layerOptions.styles[0].graphicSpacing);
    
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].strokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].strokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].strokeWidth);
  });

  it("should create a horline PolygonSymbolizer SLD string with defaults when given nulls", function(){
    layerOptions = {
      layerName: 'qct_r',
      styles: [
        {
          type: 'horline',
        }
      ]
    };

    dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
        
    // test for horline properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.lineStrokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.lineStrokeWidth);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.lineStrokeOpacity);
    
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(HZApp.Layers.LayerDefs.defaults.tileSize);

    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > se\\:Rotation > ogc\\:Literal').text())).toEqual(HZApp.Layers.LayerDefs.defaults.lineRotation);
      
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.strokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeWidth);
  });

  it("should create a horline PolygonSymbolizer SLD string with parameters", function(){
    layerOptions = {
      layerName: 'qct_r',
      styles: [
        {
          type: 'horline',
          lineStrokeColor: '#4daf4a',
          lineStrokeWidth: 5, 
          lineStrokeOpacity: 0.5,
          strokeWidth: 2.0,
          strokeColor: '#4daf4a',
          strokeOpacity: 1.0,
          tileSize: 30,
          lineRotation: 0

        }
      ]
    };

    dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
    
    // test for horline properties
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].lineStrokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].lineStrokeWidth);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Mark > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].lineStrokeOpacity);
    
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > Size').text())).toEqual(layerOptions.styles[0].tileSize);

    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Fill > GraphicFill > Graphic > se\\:Rotation > ogc\\:Literal').text())).toEqual(layerOptions.styles[0].lineRotation);
      
    expect($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke"]').text()).toEqual(layerOptions.styles[0].strokeColor);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-opacity"]').text())).toEqual(layerOptions.styles[0].strokeOpacity);
    expect(parseFloat($(dummyLayer.styleRules).find('PolygonSymbolizer > Stroke > CssParameter[name="stroke-width"]').text())).toEqual(layerOptions.styles[0].strokeWidth);
  });

  it("should create a polygon PolygonSymbolizer SLD string with defaults if no style type is given at all", function(){
      layerOptions = {
        layerName: 'qct',
        styles: [
          {
            type: ''
          }
        ]
      };

      dummyLayer = new HZApp.Layers.LayerUtils.newSLDXMLStyle(layerOptions);
      expect($(dummyLayer.styleRules).find('CssParameter[name="fill"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.fillColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="fill-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.fillOpacity);
      expect($(dummyLayer.styleRules).find('CssParameter[name="stroke"]').text()).toEqual(HZApp.Layers.LayerDefs.defaults.strokeColor);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-width"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeWidth);
      expect(parseFloat($(dummyLayer.styleRules).find('CssParameter[name="stroke-opacity"]').text())).toEqual(HZApp.Layers.LayerDefs.defaults.strokeOpacity);
  });

});
