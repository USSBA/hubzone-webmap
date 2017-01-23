// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Layers.LayerDefs = (function(){
  var defaults = {
    circleFillColor: '#FFFFFF',
    displacementX: 0,
    displacementY: 0,
    fillColor: '#CCCCCC',
    fillOpacity: 0.5,
    graphicSpacing: 10,
    lineStrokeColor: '#000000',
    lineStrokeOpacity: 1,
    lineStrokeWidth: 1,
    strokeColor: '#CCCCCC',
    strokeOpacity: 1,
    strokeWidth: 1.25,
    tileSize: 10,

    qctColor: '#4DAF4A',
    qnmcColor: '#377EB8',
    indianLandsColor: '#FF7F00'
  };

  var hzWMSOverlays = {
    indian_lands: {
      overlay: [],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: defaults.indianLandsColor,
          fillOpacity: defaults.fillOpacity,
          strokeColor: defaults.indianLandsColor,
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
        }
      ]
    },
    qnmc_e: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: defaults.qnmcColor,
          fillOpacity: defaults.fillOpacity,
          strokeColor: defaults.qnmcColors,
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
        }
      ]
    },
    qnmc_r: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'horline',
          lineStrokeColor: defaults.qnmcColor,
          lineStrokeWidth: 5, 
          lineStrokeOpacity: defaults.fillOpacity,
          strokeWidth: defaults.strokeWidth,
          strokeColor: defaults.qnmcColor,
          strokeOpacity: defaults.strokeOpacity,
          tileSize: 30,
          lineRotation: 0
        }
      ]
    },
    qnmc_brac: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'circle',
          circleFillColor: defaults.qnmcColor,
          circleFillOpacity: defaults.fillOpacity,
          circleStrokeColor: defaults.qnmcColor,
          circleStrokeOpacity: defaults.strokeOpacity,
          circleStrokeWidth: defaults.strokeWidth,
          strokeColor: defaults.qnmcColor,
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth,
          tileSize: 15,
          graphicSpacing: 5
        }
      ]
    },
    qct_e: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: defaults.qctColor,
          fillOpacity: defaults.fillOpacity,
          strokeColor: defaults.qctColor,
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
        }
      ]
    },
    qct_r: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'horline',
          lineStrokeColor: defaults.qctColor,
          lineStrokeWidth: 5, 
          lineStrokeOpacity: defaults.fillOpacity,
          strokeWidth: defaults.strokeWidth,
          strokeColor: defaults.qctColor,
          strokeOpacity: defaults.strokeOpacity,
          tileSize: 30,
          lineRotation: 0
        }
      ]
    },
    qct_brac: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'circle',
          circleFillColor: defaults.qctColor,
          circleFillOpacity: defaults.fillOpacity,
          circleStrokeColor: defaults.qctColor,
          circleStrokeOpacity: defaults.strokeOpacity,
          circleStrokeWidth: defaults.strokeWidth,
          strokeColor: defaults.qctColor,
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth,
          tileSize: 15,
          graphicSpacing: 5
        }
      ]
    },    
    brac: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'circle',
          circleFillColor: '#FFFFFF',
          circleFillOpacity: defaults.fillOpacity,
          circleStrokeColor: '#CCCCCC',
          circleStrokeOpacity: defaults.strokeOpacity,
          circleStrokeWidth: defaults.strokeWidth,
          strokeColor: '#CCCCCC',
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth,
          tileSize: 15,
          graphicSpacing: 5
        }
      ]
    },
  };

  return {
    defaults: defaults,
    hzWMSOverlays: hzWMSOverlays
  };
})();
