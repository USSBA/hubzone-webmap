// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array
// the layerIndex prop is used for order
// the object that is stuck into overlay will have a setOpacity which is used for toggling

HZApp.Layers.LayerDefs = (function(){

  return {
    hzWMSOverlays: {
      indian_lands: {
        layerIndex: 0,
        layerGroup: 'indian_lands',
        isVisible: true,
        overlay: [],
      },
      qnmc_e: {
        layerIndex: 1,
        layerGroup: 'qnmc',
        isVisible: true,
        overlay:[],
      },
      redesignated_lg: {
        layerIndex: 2,
        layerGroup: 'redesignated',
        isVisible: true,
        overlay:[],
      },
      brac_lg: {
        layerIndex: 3,
        layerGroup: 'brac',
        isVisible: true,
        overlay:[],
      },
      qct_e: {
        layerIndex: 4,
        layerGroup: 'qct',
        isVisible: true,
        overlay:[],
      }
    }
  };
})();
