//= require hzmap/sidebar
//= require hzmap/ga
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  beforeEach(function() {
    HZSpecHelper.mockPage.build();
    HZApp.SidebarUtils.buildSidebar();
    sidebar = HZApp.SidebarUtils.sidebar;
  });

  afterEach(function() {
    HZApp.SidebarUtils.sidebar = {};
    sidebar = {};
    HZSpecHelper.mockPage.destroy();
  });

  it ("should create a sidebar", function(){
    expect(sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    expect(sidebar.hasClass('hidden')).toBe(true);
  });
  describe("sidebar opening behavior", function(){
    it ("should open and move legend on mobile", function() {
      sidebar.open();
      expect(sidebar.hasClass('on')).toBe(true);
      expect($('#legend')[0].className).toContain('legend-mobile');
    });

    it ("should catch the button click to trigger the sidebar to close", function() {
      sidebar.open();
      HZApp.SidebarUtils.triggerSidebar();
      expect(sidebar.hasClass('closed')).toBe(true);
    });
  });

  describe("sidebar closing behavior", function(){
    it ("should close and move legend on mobile", function() {
      sidebar.close();
      expect(sidebar.hasClass('hidden')).toBe(true);
      expect($('#legend')[0].className).not.toContain('legend-mobile');
    });

    it ("should catch the button click to trigger the sidebar to open", function() {
      sidebar.close();
      HZApp.SidebarUtils.triggerSidebar();
      expect(sidebar.hasClass('on')).toBe(true);
    });
  });

  describe("additional details open/close behavior", function(){
    // before each, set the accordion to the 'closed' state
    beforeEach(function(){
      $('#additional-details-button').attr('aria-expanded', 'false');
      $('#additional-details-accordion').attr('aria-hidden', 'true');
    });

    it ("should be closed by default on sidebar open", function(){
      sidebar.open();
      expect(HZApp.SidebarUtils.accordionIsOpen).toBe('false');
      expect($('#additional-details-button').attr('aria-expanded')).toEqual('false');
      expect($('#additional-details-accordion').attr('aria-hidden')).toEqual('true');
    });

    it ("should open the additonal details panel", function(){
      sidebar.open();
      var accordion = $('.usa-accordion-button');
      HZApp.SidebarUtils.bindAccordion(accordion);
      HZApp.SidebarUtils.accordionIsOpen = 'false';
      accordion.trigger('click');
      expect($('#additional-details-button').attr('aria-expanded')).toEqual('true');
      expect($('#additional-details-accordion').attr('aria-hidden')).toEqual('false');
    });

    it ("should close the additonal details panel", function(){
      sidebar.open();
      var accordion = $('.usa-accordion-button');
      HZApp.SidebarUtils.bindAccordion(accordion);
      // open the accordion before closing it
      $('#additional-details-button').attr('aria-expanded', 'true');
      $('#additional-details-accordion').attr('aria-hidden', 'false');

      accordion.trigger('click');
      expect($('#additional-details-button').attr('aria-expanded')).toEqual('false');
      expect($('#additional-details-accordion').attr('aria-hidden')).toEqual('true');
    });
  });

  it ("should update the attributes on the qualifications div for the screen reader", function(){
    var hz_elem  = $('#hubzone-qualifications');
    spyOn(hz_elem, 'focus').and.callThrough();
    HZApp.SidebarUtils.updateA11yFocus(hz_elem);
    expect(hz_elem.attr('aria-live')).toEqual('rude');
    expect(hz_elem.attr('tabindex')).toEqual('-1');
    expect(hz_elem.focus.calls.count()).toEqual(1);
  });
});
