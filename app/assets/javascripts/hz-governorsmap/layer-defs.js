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
      sba_gov_elig_county: {
        layerIndex: 4,
        layerGroup: 'sba_gov_elig_county',
        isVisible: true,
        overlay:[],
      },
      sba_gov_elig_tract: {
        layerIndex: 5,
        layerGroup: 'sba_gov_elig_county',
        isVisible: true,
        overlay:[],
      },
      qnmc_e: {
        layerIndex: 6,
        layerGroup: 'qnmc',
        isVisible: true,
        overlay:[],
      },
      qct_e: {
        layerIndex: 7,
        layerGroup: 'qct',
        isVisible: true,
        overlay:[],
      },
      qda_lg: {
        layerIndex: 8,
        layerGroup: 'qda',
        isVisible: true,
        overlay:[],
      },
      indian_lands: {
        layerIndex: 9,
        layerGroup: 'indian_lands',
        isVisible: true,
        overlay: [],
      },
      redesignated_lg: {
        layerIndex: 10,
        layerGroup: 'redesignated',
        isVisible: true,
        overlay:[],
      },
      qnmc_r: {
        layerIndex: 11,
        layerGroup: 'qnmc_r',
        isVisible: true,
        overlay:[],
      },
      qct_r: {
        layerIndex: 12,
        layerGroup: 'qct_r',
        isVisible: true,
        overlay:[],
      },
      qnmc_qda: {
        layerIndex: 13,
        layerGroup: 'qnmc_qda',
        isVisible: true,
        overlay:[],
      },
      qct_qda: {
        layerIndex: 14,
        layerGroup: 'qnmc_r',
        isVisible: true,
        overlay:[],
      },
      qct_r_slivers: {
        layerIndex: 15,
        layerGroup: 'qct_r_slivers',
        isVisible: true,
        overlay:[],
      },
      sba_gov_elig_county: {
        layerIndex: 16,
        layerGroup: 'sba_gov_elig_county',
        isVisible: true,
        overlay:[],
      },
  
      sba_gov_elig_tract: {
        layerIndex: 17,
        layerGroup: 'sba_gov_elig_tract',
        isVisible: true,
        overlay:[],
      },
      mvw_gov_area_map: {
        layerIndex: 18,
        layerGroup: 'mvw_gov_area_map',
        isVisible: true,
        overlay:[],
      },
      mvw_gov_area_map_county: {
        layerIndex: 19,
        layerGroup: 'mvw_gov_area_map',
        isVisible: true,
        overlay:[],
      },
      usda_rural_partner_networks: {
        layerIndex: 20,
        layerGroup: 'usda_rural_partner_networks',
        isVisible: true,
        overlay:[],
      },
      treasury_opportunity_zones: {
        layerIndex: 21,
        layerGroup: 'treasury_opportunity_zones',
        isVisible: true,
        overlay:[],
      },
      
       /*qct_r_extras: {
        layerIndex: 11,
        layerGroup: 'qct_r_extras',
        isVisible: false,
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
        isVisible: false,
        overlay:[],
      },
      qda_lg: {
        layerIndex: 7,
        layerGroup: 'qda',
        isVisible: false,
        overlay:[],
      },
      mvw_gov_area_map: {
        layerIndex: 8,
        layerGroup: 'mvw_gov_area_map',
        isVisible: false,
        overlay:[],
      },
      mvw_gov_area_map_county: {
        layerIndex: 9,
        layerGroup: 'mvw_gov_area_map',
        isVisible: false,
        overlay:[],
      },
      // qct_old: {
      //   layerIndex: 8,
      //   layerGroup: 'qct_old',
      //   isVisible: true,
      //   overlay:[],
      // },*/
    }
  };
})();
