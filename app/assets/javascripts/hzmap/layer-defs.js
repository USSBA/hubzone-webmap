// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Layers.LayerDefs = (function(){
  var defaults = {
    circleSize: 3,
    fillColor: '#377EB8',
    circleFillColor: '#FFFFFF',
    displacementX: 0,
    displacementY: 0,
    fillOpacity: 0.5,
    lineStrokeColor: '#000000',
    tileSize: 10,
    strokeColor: '#377EB8',
    strokeOpacity: 1,
    strokeWidth: 1.25
  };

  var hzWMSOverlays = {
    indian_lands: {
      overlay: [],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#984EA3',
          fillOpacity: defaults.fillOpacity,
          strokeColor: '#984EA3',
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
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
          fillOpacity: defaults.fillOpacity,
          strokeColor: '#377EB8',
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
        }
      ]
    },
    qct_e: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        {
          type: 'polygon',
          fillColor: '#4DAF4A',
          fillOpacity: defaults.fillOpacity,
          strokeColor: '#4DAF4A',
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
          type: 'polygon',
          fillColor: '#4DAF4A',
          fillOpacity: defaults.fillOpacity,
          strokeColor: '#4DAF4A',
          strokeOpacity: defaults.strokeOpacity,
          strokeWidth: defaults.strokeWidth
        },
        {
          type: 'horline',
          lineStrokeColor: '#FFFFFF',
          strokeWidth: 3, 
          strokeOpacity: 0.8,
          tileSize: defaults.tileSize,
          displacementX: 0,
          displacementY: 0
        }
      ]
    },
    qct_brac: {
      overlay:[],
      sldXMLStyle: null,
      styleOptions: [
        // {
        //   type: 'polygon',
        //   fillColor: '#4DAF4A',
        //   fillOpacity: defaults.fillOpacity,
        //   strokeColor: '#4DAF4A',
        //   strokeOpacity: defaults.ftrokeOpacity,
        //   strokeWidth: defaults.strokeWidth
        // },
        {
          type: 'circle',
          circleFillColor: '#FFFFFF',
          fillOpacity: defaults.fillOpacity,
          strokeColor: '#4DAF4A',
          strokeWidth: defaults.strokeWidth,
          strokeOpacity: defaults.stokeOpacity,
          tileSize: defaults.tileSize
        }
      ]
    },
    // brac: {
    //   overlay: [],
    //   sldXMLStyle: null,
    //   styleOptions: [
    //     {
    //       type: 'polygon',
    //       fillColor: '#FF7F00',
    //       fillOpacity: defaults.defaultFillOpacity,
    //       strokeColor: '#FF7F00',
    //       strokeOpacity: defaults.defaultStrokeOpacity,
    //       strokeWidth: defaults.defaultStrokeWidth
    //     }
    //   ]
    // }
  };

  return {
    defaults: defaults,
    hzWMSOverlays: hzWMSOverlays
  };
})();
