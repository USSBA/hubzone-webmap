// hubzone data layer style config

// this object holds the current google overlays
// order in this object defines draw order on the map
var wmsGroundOverlay = {
  indian_lands: [],
  qnmc: [],
  qct: [],
  brac: []
};

var defaultFillOpacity = 0.5;
var defaultStrokeOpacity = 1;
var defaultStrokeWidth = 1.25;
/* jshint unused: false */
var hzMapLayerStyle = {
  "indian_lands": {
    layer: "indian_lands",
    fillColor: '#984EA3',
    zIndex: 10,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#984EA3',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: false
  },
  "brac": {
    layer: "brac",
    fillColor: '#FF7F00',
    zIndex: 30,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#FF7F00',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  },
  "qct": {
    layer: "qct",
    fillColor: '#4DAF4A',
    zIndex: 20,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#4DAF4A',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  },
  "qnmc": {
    layer: "qnmc",
    fillColor: '#377EB8',
    zIndex: 5,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#377EB8',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  }
};

// helperf for building out the style object
function constructSLDXML(options){
  return encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>' +
          '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">' + 
          '<NamedLayer>' +
          '<Name>hubzone-test:' + options.layer + '</Name>' +
          '<UserStyle>' +
          '<FeatureTypeStyle>' +
          (options.styleExpiring ? styleWithExpiration(options) : styleWithoutExpiration(options) ) + 
          '</FeatureTypeStyle>' +
          '</UserStyle>' +
          '</NamedLayer>' +
          '</StyledLayerDescriptor>');
}

function styleWithExpiration(options){
return ('<Rule>' + 
        '<Name>not expiring</Name>' + 
        '<ogc:Filter>' + 
        '<ogc:PropertyIsEqualTo>' + 
        '<ogc:Function name="isNull">' + 
        '<ogc:PropertyName>stop</ogc:PropertyName>' + 
        '</ogc:Function>' + 
        '<ogc:Literal>true</ogc:Literal>' + 
        '</ogc:PropertyIsEqualTo>' + 
        '</ogc:Filter>' + 
        '<PolygonSymbolizer>' + 
        '<Fill>' + 
        '<CssParameter name="fill">' + options.fillColor + '</CssParameter>' + 
        '<CssParameter name="fill-opacity">' + options.fillOpacity + '</CssParameter>' + 
        '</Fill>' + 
        '<Stroke>' + 
        '<CssParameter name="stroke">' + options.strokeColor + '</CssParameter>' + 
        '<CssParameter name="stroke-width">' + options.strokeWidth + '</CssParameter>' + 
        '</Stroke>' + 
        '</PolygonSymbolizer>' + 
        '</Rule>' + 
        '<Rule>' + 
        '<Name>expiring</Name>' + 
        '<ogc:Filter>' + 
        '<ogc:PropertyIsEqualTo>' + 
        '<ogc:Function name="isNull">' + 
        '<ogc:PropertyName>stop</ogc:PropertyName>' + 
        '</ogc:Function>' + 
        '<ogc:Literal>false</ogc:Literal>' + 
        '</ogc:PropertyIsEqualTo>' + 
        '</ogc:Filter>' + 
        '<PolygonSymbolizer>' + 
        '<Fill>' + 
        '<GraphicFill>' + 
        '<Graphic>' + 
        '<Mark>' + 
        '<WellKnownName>shape://backslash</WellKnownName>' + 
        '<Stroke>' + 
        '<CssParameter name="stroke">' + options.strokeColor + '</CssParameter>' + 
        '<CssParameter name="stroke-width">' + options.strokeWidth + '</CssParameter>' + 
        '</Stroke>' + 
        '</Mark>' + 
        '<Size>16</Size>' + 
        '</Graphic>' + 
        '</GraphicFill>' + 
        '</Fill>' + 
        '<Stroke>' + 
        '<CssParameter name="stroke">' + options.strokeColor + '</CssParameter>' + 
        '<CssParameter name="stroke-width">' + options.strokeWidth + '</CssParameter>' + 
        '</Stroke>' + 
        '</PolygonSymbolizer>' + 
        '</Rule>');
}

function styleWithoutExpiration(options){
  return ('<Rule>' + 
          '<Name>not expiring</Name>' + 
          '<PolygonSymbolizer>' + 
          '<Fill>' + 
          '<CssParameter name="fill">' + options.fillColor + '</CssParameter>' + 
          '<CssParameter name="fill-opacity">' + options.fillOpacity + '</CssParameter>' + 
          '</Fill>' + 
          '<Stroke>' + 
          '<CssParameter name="stroke">' + options.strokeColor + '</CssParameter>' + 
          '<CssParameter name="stroke-width">' + options.strokeWidth + '</CssParameter>' + 
          '</Stroke>' + 
          '</PolygonSymbolizer>' + 
          '</Rule>');
}

