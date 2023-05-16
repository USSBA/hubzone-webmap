// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array
// the layerIndex prop is used for order
// the object that is stuck into overlay will have a setOpacity which is used for toggling

HZApp.Layers.LayerDefs = (function(){

  return {
    hzWMSOverlays: {
      non_qnmc_e: {
        layerIndex: 0,
        layerGroup: 'us_county',
        isVisible: true,
        overlay:[],
      },
      non_qct_e: {
        layerIndex: 1,
        layerGroup: 'us_tract',
        isVisible: true,
        overlay:[],
      },
      indian_lands: {
        layerIndex: 2,
        layerGroup: 'indian_lands',
        isVisible: true,
        overlay: [],
      },
      qnmc_e: {
        layerIndex: 3,
        layerGroup: 'qnmc',
        isVisible: true,
        overlay:[],
      },

      redesignated_lg: {
        layerIndex: 4,
        layerGroup: 'redesignated',
        isVisible: true,
        overlay:[],
      },
      
      qct_r_slivers: {
        layerIndex: 10,
        layerGroup: 'qct_r_slivers',
        isVisible: true,
        overlay:[],
      },
      qct_r_extras: {
        layerIndex: 11,
        layerGroup: 'qct_r_extras',
        isVisible: true,
        overlay:[],
      },

      // brac_lg: {
      //   layerIndex: 5,
      //   layerGroup: 'brac',
      //   isVisible: false,
      //   overlay:[],
      // },
      qct_e: {
        layerIndex: 6,
        layerGroup: 'qct',
        isVisible: true,
        overlay:[],
      },
      qda_lg: {
        layerIndex: 7,
        layerGroup: 'qda',
        isVisible: true,
        overlay:[],
      },
      mvw_gov_area_map: {
        layerIndex: 8,
        layerGroup: 'mvw_gov_area_map',
        isVisible: true,
        overlay:[],
      },
      mvw_gov_area_map_county: {
        layerIndex: 9,
        layerGroup: 'mvw_gov_area_map',
        isVisible: true,
        overlay:[],
      },
      // qct_old: {
      //   layerIndex: 8,
      //   layerGroup: 'qct_old',
      //   isVisible: true,
      //   overlay:[],
      // },
    }
  };
})();
