//= require hzmap/legend-defs
//= require hzmap/legend
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing legend operations', function() {
  beforeEach(function(){
    HZSpecHelper.mockPage.build();
    HZApp.Legend.buildLegend(HZSpecHelper.testLayers);
  });

  afterEach(function(){
    HZSpecHelper.mockPage.destroy();
    Object.keys(HZApp.Legend.legend).map(function(legendItem){
      HZApp.Legend.legend[legendItem].svg = [];
    });
  });

  describe ('Testing legend style object utilities', function() {
    beforeEach(function(){
      testLayers = HZSpecHelper.testLayers;
    });

    it("should run the getConfigFromLayerStyle method on each layer", function(){
      spyOn(HZApp.Legend, 'getConfigFromLayerStyle').and.callThrough();
      spyOn(HZApp.Legend, 'insertLegendItem');
      spyOn(HZApp.Legend, 'addLayerToggleListeners');
      spyOn(HZApp.Legend, 'addLegendButtonListeners');
      spyOn(HZApp.Legend, 'setLegendState');

      HZApp.Legend.buildLegend(testLayers);
      expect(HZApp.Legend.getConfigFromLayerStyle.calls.count()).toEqual(Object.keys(testLayers).length);
      expect(HZApp.Legend.insertLegendItem.calls.count()).toEqual(Object.keys(HZApp.Legend.legend).length);
      expect(HZApp.Legend.addLayerToggleListeners.calls.count()).toEqual(1);
      expect(HZApp.Legend.addLegendButtonListeners.calls.count()).toEqual(1);
      expect(HZApp.Legend.setLegendState.calls.count()).toEqual(1);
    });

    it("should parse the layer config into a legendConfig", function(){
      var layer = testLayers['qnmc_e'];
      var legendConfig = HZApp.Legend.getConfigFromLayerStyle(layer);
      expect(legendConfig.layerGroup).toEqual(layer.layerGroup);
      expect(legendConfig.styleType).toEqual(layer.styleOptions[0].type);
      expect(legendConfig.styleColor).toEqual(layer.styleOptions[0][HZApp.Legend.legendTypeToColorType[legendConfig.styleType]]);
    });
  });

  // these will test the SVG creatorsthat the correct styles are inserted in the right way
  describe ('Testing svg creators', function() {
    it("should make the correct svg header", function(){
      var width = 10, height = 11;
      var svgHeaderStr = HZApp.Legend.svgHeader(width, height);
      expect($(svgHeaderStr).attr('width')).toEqual(width + 'px');
      expect($(svgHeaderStr).attr('height')).toEqual(height + 'px');
      expect($(svgHeaderStr)[0].getAttribute('viewBox')).toEqual('0 0 ' + (width+5) + ' ' + height);
    });

    it("should make the correct polygon svg", function(){
      var width = 10, height = 11;
      var style = {
        styleColor: '#00FF00'
      };

      var svgPolyStr = HZApp.Legend.svg_polygon(style, width, height);
      expect(parseInt($(svgPolyStr).find('rect').attr('width'))).toEqual(width);
      expect(parseInt($(svgPolyStr).find('rect').attr('height'))).toEqual(height);
      expect($(svgPolyStr).attr('fill')).toEqual(style.styleColor);
    });

    it("should make the correct lined svg", function(){
      var width = 10, height = 11;
      var style = {
        styleColor: '#00FF00'
      };

      var svgLineStr = HZApp.Legend.svg_horline(style, width, height);
      expect(parseInt($(svgLineStr).find('rect').attr('width'))).toEqual(width);
      expect(parseInt($(svgLineStr).find('rect').attr('height'))).toEqual(height);
      expect($(svgLineStr)[1].getAttribute('stroke')).toEqual(style.styleColor);
      $(svgLineStr).find('path').each(function(idx, elem){
        expect(elem.getAttribute('stroke')).toEqual(style.styleColor);
      });
    });

    it("should make the correct dots svg", function(){
      var width = 10, height = 11;
      var style = {
        styleColor: '#00FF00'
      };

      var svgCircleStr = HZApp.Legend.svg_circle(style, width, height);
      expect(parseInt($(svgCircleStr).find('rect').attr('width'))).toEqual(width);
      expect(parseInt($(svgCircleStr).find('rect').attr('height'))).toEqual(height);
      expect($(svgCircleStr)[1].getAttribute('stroke')).toEqual(style.styleColor);
      $(svgCircleStr).find('ellipse').each(function(idx, elem){
        expect(elem.getAttribute('fill')).toEqual(style.styleColor);
      });
      $(svgCircleStr).find('circle').each(function(idx, elem){
        expect(elem.getAttribute('fill')).toEqual(style.styleColor);
      });
    });
  });

  // check that the correct svg creator method is called for each styleType
  describe ('svgFromStyle', function() {
    beforeEach(function(){
      spyOn(HZApp.Legend, 'svgHeader');
      style = {
        styleType: ''
      };
    });

    ['polygon', 'horline', 'circle'].map(function(styleType){
      var fn_name = "svg_" + styleType;
      it(("should run " + fn_name) , function(){
        spyOn(HZApp.Legend, fn_name);
        style.styleType = styleType;
        HZApp.Legend.svgFromStyle(style);
        expect(HZApp.Legend[fn_name].calls.count()).toEqual(1);
      });
    });
  });

  describe ('insertLegendItem', function(){

    var testLegend = function(legendItem){
      describe('on ' + legendItem, function(){
        it ('builds out a legend with the correct features for ' + legendItem, function(){
          var legendProps = HZApp.Legend.legend[legendItem];

          if(HZApp.Legend.legend[legendItem].canToggle) {
            expect($('#legend-' + legendItem + '> label > span').text()).toEqual(legendProps.title);
            var legendSvgWithLabel = $('#legend-' + legendItem + '> label > svg');
            var legendSvgWithLabelLength = legendSvgWithLabel['length'] || 0;
            expect(legendSvgWithLabelLength).toEqual(legendProps.svg.length);
          } else {
            expect($('#legend-' + legendItem + '> span').text()).toEqual(legendProps.title);
            var legendSvg = $('#legend-' + legendItem + '> svg');
            var legendSvgLength = legendSvg['length'] || 0;
            expect(legendSvgLength).toEqual(legendProps.svg.length);
          }
        });
      });
    };

    Object.keys(HZApp.Legend.legend).map(function(legendItem){
      testLegend(legendItem);
    });
  });

  describe ('toggle legend visibility', function(){

    it('should add listener for legend header click', function() {
      spyOn(HZApp.Legend, 'toggleLegendVisibility');
      $('#legend-header').trigger('click');
      expect(HZApp.Legend.toggleLegendVisibility.calls.count()).toEqual(1);
    });

    it('should collapse on legend-header click', function() {
       spyOn(HZApp.Legend, 'hideLegend');
       HZApp.Legend.toggleLegendVisibility('open');
       expect(HZApp.Legend.hideLegend.calls.count()).toEqual(1);
    });

    it('should expand legend on legend-header click if collapsed', function() {
       spyOn(HZApp.Legend, 'showLegend');
       HZApp.Legend.toggleLegendVisibility('');
       expect(HZApp.Legend.showLegend.calls.count()).toEqual(1);
    });

    it('should be initially collapsed on mobile', function() {
      spyOn(HZApp.Legend, 'hideLegend');
      HZApp.Legend.setLegendState(900);
      expect(HZApp.Legend.hideLegend.calls.count()).toEqual(1);
    });

    it('should be initially expanded on desktop', function() {
      spyOn(HZApp.Legend, 'showLegend');
      HZApp.Legend.setLegendState(1000);
      expect(HZApp.Legend.showLegend.calls.count()).toEqual(1);
    });

    it('should collapse the legend', function(){
      HZApp.Legend.hideLegend();
      expect($('#legend li.legend-item').is(':visible')).toBe(false);
      expect($('#hide-legend-button').is(':visible')).toBe(false);
      expect($('#legend-header-title-expanded').is(':visible')).toBe(false);
      expect($('#legend-header-title-hidden').css('display')).not.toEqual('none');
      expect($('#show-legend-button').css('display')).not.toEqual('none');
    });

    it('should show the collapsed legend', function(){
      HZApp.Legend.hideLegend();
      HZApp.Legend.showLegend();

      expect($('#legend li.legend-item').is(':visible')).toBe(true);
      expect($('#hide-legend-button').is(':visible')).toBe(true);
      expect($('#legend-header-title-hidden').is(':visible')).toBe(false);
      expect($('#legend-header-title-expanded').css('display')).not.toEqual('none');
      expect($('#show-legend-button').is(':visible')).toBe(false);
    });
  });

  describe ('toggle layer visibility', function() {

    it('should listen for layer toggle checkbox click', function() {
      spyOn(HZApp.Legend, 'setLayerGroups');
      $('input#mock-checkbox').trigger('click');
      expect(HZApp.Legend.setLayerGroups.calls.count()).toEqual(1);
    });

    it('should set layer groups', function(){
      spyOn(HZApp.Legend, 'toggleLayerGroup');
      var mockGroup = 'qnmc';
      HZApp.Legend.setLayerGroups(mockGroup, HZSpecHelper.testLayers);
      expect(HZApp.Legend.toggleLayerGroup.calls.count()).toEqual(3);
    });

    it('should toggle layers off', function(){
      var layer = 'qnmc_brac';
      var mockOverlay = new HZSpecHelper.NewOverlay('new');
      spyOn(mockOverlay, 'setOpacity');
      HZSpecHelper.testLayers[layer].overlay = mockOverlay;
      HZSpecHelper.testLayers[layer].isVisible = true;
      HZApp.Legend.toggleLayerGroup(HZSpecHelper.testLayers[layer]);
      expect(mockOverlay.setOpacity.calls.count()).toEqual(1);
      expect(HZSpecHelper.testLayers[layer].isVisible).toEqual(false);
    });

    it('should toggle layers on', function(){
      var layer = 'qnmc_e';
      var mockOverlay = new HZSpecHelper.NewOverlay('new');
      spyOn(mockOverlay, 'setOpacity');
      HZSpecHelper.testLayers[layer].overlay = mockOverlay;
      HZSpecHelper.testLayers[layer].isVisible = false;
      HZApp.Legend.toggleLayerGroup(HZSpecHelper.testLayers[layer]);
      expect(mockOverlay.setOpacity.calls.count()).toEqual(1);
      expect(HZSpecHelper.testLayers[layer].isVisible).toEqual(true);
    });
  });

});




