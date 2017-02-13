// hubzone data layer style definitions

// this object holds the current google overlays in the .overlay array and the per layer styles
// order in this object defines draw order on the map:
// first object is drawn first, then next on top of that, etc.
HZApp.Legend.LegendDefs = (function(){
  var legendDefaults = {
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
    lineStrokeColor: '#fff',
    lineStrokeOpacity: 1,
    lineStrokeWidth: 1,
    lineRotation: 0,
    strokeColor: '#CCCCCC',
    strokeOpacity: 1,
    strokeWidth: 1.25,
    tileSize: 10,

    // USWDS Alt 1
    qctColor: '#2E8540',
    qnmcColor: '#0071BB',
    indianLandsColor: '#4C2C92'
  };

  var legendKeys = {
    qct: {
      title: "Census Tract",
      svg: [],
      canToggle: true,
      layerGroup: 'qct',
      styleOptions: [
        {
          type: 'polygon',
          fillColor: legendDefaults.qctColor,
          fillOpacity: legendDefaults.fillOpacity,
          strokeColor: legendDefaults.qctColor,
          strokeOpacity: legendDefaults.strokeOpacity,
          strokeWidth: legendDefaults.strokeWidth
        }
      ]
    },
    qnmc: {
      title: "County",
      svg: [],
      canToggle: true,
      layerGroup: 'qnmc',
      styleOptions: [
        {
          type: 'polygon',
          fillColor: legendDefaults.qnmcColor,
          fillOpacity: legendDefaults.fillOpacity,
          strokeColor: legendDefaults.qnmcColors,
          strokeOpacity: legendDefaults.strokeOpacity,
          strokeWidth: legendDefaults.strokeWidth
        }
      ]
    },
    indian_lands: {
      title: "Indian Land",
      svg: [],
      canToggle: true,
      layerGroup: 'indian_lands',
      styleOptions: [
        {
          type: 'polygon',
          fillColor: legendDefaults.indianLandsColor,
          fillOpacity: legendDefaults.fillOpacity,
          strokeColor: legendDefaults.indianLandsColor,
          strokeOpacity: legendDefaults.strokeOpacity,
          strokeWidth: legendDefaults.strokeWidth
        }
      ]
    },
    redesignated: {
      title: "Redesignated",
      svg: [],
      canToggle: true,
      layerGroup: 'redesignated',
      styleOptions: [
        {
         type: 'horline',
          lineStrokeColor: legendDefaults.lineStrokeColor,
          lineStrokeWidth: 5,
          lineStrokeOpacity: legendDefaults.fillOpacity,
          strokeWidth: legendDefaults.strokeWidth,
          strokeColor: legendDefaults.lineStrokeColor,
          strokeOpacity: legendDefaults.strokeOpacity,
          tileSize: 30,
          lineRotation: 0
        }
      ]
    },
    brac: {
      title: "Base Closure Area",
      svg: [],
      canToggle: true,
      layerGroup: 'brac',
      styleOptions: [
        {
          type: 'circle',
          circleFillColor: '#fff',
          circleFillOpacity: legendDefaults.fillOpacity,
          circleStrokeColor: '#fff',
          circleStrokeOpacity: legendDefaults.strokeOpacity,
          circleStrokeWidth: legendDefaults.strokeWidth,
          strokeColor: '#000000',
          strokeOpacity: legendDefaults.strokeOpacity,
          strokeWidth: legendDefaults.strokeWidth,
          tileSize: 15,
          graphicSpacing: legendDefaults.graphicSpacing
        }
      ]
    },
  };

  return {
    legendDefaults: legendDefaults,
    legend: legendKeys
  };

})();
