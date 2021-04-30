// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Legend.LegendDefs = (function(){
  var legendKeys = {
    qct: {
      title: "Census Tract",
      svg: [],
      canToggle: true,
      layerGroup: 'qct'
    },
    indian_lands: {
      title: "Indian Land",
      svg: [],
      canToggle: true,
      layerGroup: 'indian_lands'
    },
    qnmc: {
      title: "County",
      svg: [],
      canToggle: true,
      layerGroup: 'qnmc'
    },
    redesignated: {
      title: "Redesignated",
      svg: [],
      canToggle: true,
      layerGroup: 'redesignated'
    },
    brac: {
      title: "Base Closure Area",
      svg: [],
      canToggle: true,
      layerGroup: 'brac'
    },
    mvw_gov_area_map: {
      title: "Governor-Designated Covered Area",
      svg: [],
      canToggle: true,
      layerGroup: 'mvw_gov_area_map'
    },
    mvw_gov_area_map_county: {
      title: "Governor-Designated Covered Area",
      svg: [],
      canToggle: true,
      layerGroup: 'mvw_gov_area_map'
    }
  };
  return {
    legend: legendKeys
  };
})();
