// legend utilties
HZApp.Legend = (function(){
  return {
    legend: HZApp.Legend.LegendDefs.legend,
    buildLegend: function(){
      this.addLegendButtonListeners();
      this.setMobileState(window.innerWidth);
      this.addLayerToggleListeners();
    },
    addLegendButtonListeners: function(){
      $('.legend-header').click(function(event) {
        HZApp.Legend.toggleLegendVisibility(event.currentTarget.className);
      });
    },
    toggleLegendVisibility: function(legendState) {
        if(legendState.indexOf('open', 0) !== -1) {
          HZApp.Legend.hideLegend();
        } else {
          HZApp.Legend.showLegend();
        }
    },
    hideLegend: function(){
      $('.legend-item').hide();
      $('.legend-button').addClass("fa-chevron-up").removeClass("fa-chevron-down");
      $('.legend-content').hide();
      $('.legend-header').removeClass('open');
    },
    showLegend: function(){
      $('.legend-item').show();
      $('.legend-button').addClass("fa-chevron-down").removeClass("fa-chevron-up");
      $('.legend-content').show();
      $('.legend-header').addClass('open');
    },
    setMobileState: function(windowWidth) {
      if (windowWidth < 950) {
        HZApp.Legend.hideLegend();
      }
    },
    addLayerToggleListeners: function() {
      $('input[type="checkbox"]').click( function(event){
        HZApp.Legend.setLayerGroups(event.currentTarget.value, HZApp.Layers.LayerDefs.hzWMSOverlays);
      });
    },
    setLayerGroups: function(selectedLayer, wmsOverlays) {
      Object.keys(wmsOverlays).map(function(layer) {
        if(wmsOverlays[layer].layerGroup === selectedLayer){
          HZApp.Legend.toggleLayerGroup(wmsOverlays[layer]);
        } else {
        }
      });
    },
    toggleLayerGroup: function(layer) {
      if(layer.isVisible){
        layer.overlay.setOpacity(0);
        layer.isVisible = false;
      } else {
        layer.overlay.setOpacity(1);
        layer.isVisible = true;
      }
    }
  };
})();
