// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Layers.LayerDefs = (function(){
  var defaults = {
    circleFillColor: '#FFFFFF',
    circleFillOpacity: 0.5,
    circleStrokeColor: '#CCCCCC',
    circleStrokeOpacity: 1,
    circleStrokeWidth: 1,
    displacementX: 0,
    displacementY: 0,
    fillColor: '#CCCCCC',
    fillOpacity: 0.5,
    graphicSpacing: 10,
    lineStrokeColor: '#000000',
    lineStrokeOpacity: 1,
    lineStrokeWidth: 1,
    lineRotation: 0,
    strokeColor: '#CCCCCC',
    strokeOpacity: 1,
    strokeWidth: 1.25,
    tileSize: 10,

    // USWDS Alt 1
    qctColor: '#0D465C',
    qnmcColor: '#BA233F',
    indianLandsColor: '#009DCD'

    // color brewer 2
    // qctColor: '#1b9e77',
    // qnmcColor: '#d95f02',
    // indianLandsColor: '#7570b3'
  };

  var hzWMSOverlays = {
    indian_lands: {
      legendType: 'indian_lands',
      layerGroup: 'indian_lands',
      isVisible: true,
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
      legendType: 'qnmc',
      layerGroup: 'qnmc',
      isVisible: true,
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
      legendType: 'redesignated',
      layerGroup: 'redesignated',
      isVisible: true,
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
      legendType: 'brac',
      layerGroup: 'brac',
      isVisible: true,
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
          graphicSpacing: defaults.graphicSpacing
        }
      ]
    },
    qct_e: {
      legendType: 'qct',
      layerGroup: 'qct',
      isVisible: true,
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
      legendType: 'redesignated',
      layerGroup: 'redesignated',
      isVisible: true,
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
      legendType: 'brac',
      layerGroup: 'brac',
      isVisible: true,
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
          graphicSpacing: defaults.graphicSpacing
        }
      ]
    },
    brac: {
      legendType: 'brac',
      layerGroup: 'brac',
      isVisible: true,
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'circle',
          circleFillColor: '#000',
          circleFillOpacity: defaults.fillOpacity,
          circleStrokeColor: '#000000',
          circleStrokeOpacity: defaults.strokeOpacity,
          circleStrokeWidth: defaults.strokeWidth,
          strokeColor: '#000000',
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth,
          tileSize: 15,
          graphicSpacing: defaults.graphicSpacing
        }
      ]
    },
  };

  return {
    defaults: defaults,
    hzWMSOverlays: hzWMSOverlays
  };
})();
