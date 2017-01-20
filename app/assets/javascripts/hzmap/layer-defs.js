// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Layers.LayerDefs = (function(){
  var defaults = {
    defaultCircleSize: 3,
    defaultColor: '#377EB8',
    defaultCircleColor: '#FFFFFF',
    defaultDisplacementX: 0,
    defaultDisplacementY: 0,
    defaultFillOpacity: 0.5,
    defaultLineColor: '#000000',
    defaultLineSize: 10,
    defaultLineRotation: 0,
    defaultStrokeOpacity: 1,
    defaultStrokeWidth: 1.25
  };

  var hzWMSOverlays = {
    indian_lands: {
      overlay: [],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#984EA3',
          fillOpacity: defaults.defaultFillOpacity,
          strokeColor: '#984EA3',
          strokeOpacity: defaults.defaultStrokeOpacity,
          strokeWidth: defaults.defaultStrokeWidth
        }
      ]
    },
    qnmc: {
      overlay: [],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#377EB8',
          fillOpacity: defaults.defaultFillOpacity,
          strokeColor: '#377EB8',
          strokeOpacity: defaults.defaultStrokeOpacity,
          strokeWidth: defaults.defaultStrokeWidth
        }
      ]
    },
    qct: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#4DAF4A',
          fillOpacity: defaults.defaultFillOpacity,
          strokeColor: '#4DAF4A',
          strokeOpacity: defaults.defaultStrokeOpacity,
          strokeWidth: defaults.defaultStrokeWidth
        }
      ]
    },
    brac: {
      overlay: [],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#FF7F00',
          fillOpacity: defaults.defaultFillOpacity,
          strokeColor: '#FF7F00',
          strokeOpacity: defaults.defaultStrokeOpacity,
          strokeWidth: defaults.defaultStrokeWidth
        }
      ]
    }
  };

  return {
    defaults: defaults,
    hzWMSOverlays: hzWMSOverlays
  };
})();
