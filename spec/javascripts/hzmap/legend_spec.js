//= require hzmap
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing legend operations', function() {
  beforeEach(function(){
    fixture.cleanup();
    this.fixtures = fixture.load("legend_fixture.html", true);
    HZApp.Legend.buildLegend(HZSpecHelper.testLayers);
    testLayers = HZSpecHelper.testLayers;
  });

  describe ('build legend utility', function() {

    it("should run the build legend methods", function(){
      spyOn(HZApp.Legend, 'addLayerToggleListeners');
      spyOn(HZApp.Legend, 'addLegendButtonListeners');
      spyOn(HZApp.Legend, 'setMobileState');

      HZApp.Legend.buildLegend(testLayers);
      expect(HZApp.Legend.addLayerToggleListeners.calls.count()).toEqual(1);
      expect(HZApp.Legend.addLegendButtonListeners.calls.count()).toEqual(1);
      expect(HZApp.Legend.setMobileState.calls.count()).toEqual(1);
    });
  });

  describe ('toggle legend visibility', function(){
    it("legend should exist", function(){
      expect(document.getElementById('legend')).not.toBeNull();
    });

    it('should add listener for legend header click', function() {
      spyOn(HZApp.Legend, 'toggleLegendVisibility');
      $('.legend-header').trigger('click');
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
      HZApp.Legend.setMobileState(900);
      expect(HZApp.Legend.hideLegend.calls.count()).toEqual(1);
    });

    it('should collapse the legend', function() {
      HZApp.Legend.hideLegend();

      expect($('.legend-item').is(':visible')).toBe(false);
      expect($('.legend-button').attr('class')).toContain('fa-chevron-up');
      expect($('.legend-content').is(':visible')).toBe(false);
      expect($('.legend-header').attr('class')).not.toContain('open');

    });

    it('should show the legend', function(){
      HZApp.Legend.hideLegend();
      HZApp.Legend.showLegend();

      expect($('.legend-item').is(':visible')).toBe(true);
      expect($('.legend-button').attr('class')).toContain('fa-chevron-down');
      expect($('.legend-content').is(':visible')).toBe(true);
      expect($('.legend-header').attr('class')).toContain('open');
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
