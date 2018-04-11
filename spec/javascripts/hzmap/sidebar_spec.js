//= require hzmap/sidebar
//= require hzmap/ga
//= require hzmap/cookies
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  beforeEach(function() {
    fixture.cleanup();
    this.fixtures = fixture.load("hz_mock_sidebar.html", "hz_mock_legend.html", "hz_mock_page.html", true);
    HZApp.SidebarUtils.buildSidebar();
    sidebar = HZApp.SidebarUtils.sidebar;
    google = HZSpecHelper.google;
    HZApp.map = new google.maps.Map();
  });

  afterEach(function() {
    HZApp.SidebarUtils.sidebar = {};
    sidebar = {};
    HZApp.map = {};
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

    it ("should add the gm-sidebar-on class to expand the google zoom and street view controls", function() {
      sidebar.open();
      expect(document.querySelector('.gm-sidebar-on')).not.toBeNull();
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

    it ("should add the gm-sidebar-on class to expand the google zoom and street view controls", function() {
      sidebar.close();
      expect(document.querySelector('.gm-sidebar-on')).toBeNull();
    });
  });


  describe("sidebar clearing behavior", function(){
    it ("should empty out divs", function() {
      sidebar.clear();
      expect(sidebar.hasClass('hidden')).toBe(true);
      $('.clearable').each(function(i, elem) {
        expect(elem.innerHTML).toEqual('');
      });
    });
  });

  describe("additional details open/close behavior", function(){
    var accordion, accordion_show, accordion_hide;
    // before each, set the accordion to the 'closed' state
    beforeEach(function(){
      accordion = $('.additional-details-expand');
      accordion_show = $('.additional-details-expand.show');
      accordion_hide = $('.additional-details-expand.hide');
      HZApp.Cookies.setItem('hz-sidebar-ad-open', false);
      document.querySelector('span.additional-details-expand.show').hidden = false;
      document.querySelector('span.additional-details-expand.hide').hidden = true;
    });

    describe("details should be closed by default on sidebar open", function(){
      beforeEach(function(){
        sidebar.open();
      });
      it ("show is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(false);
      });
      it ("hide is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(true);
      });
      it ("cookie is off", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('false');
      });
    });

    describe("should open the additonal details panel", function(){
      beforeEach(function(){
        sidebar.open();
        HZApp.SidebarUtils.updateAccordion(accordion);
        accordion_show.trigger('click');
      });
      it ("show is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(true);
      });
      it ("hide is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(false);
      });
      it ("cookie is on", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('true');
      });
    });

    describe("should close the additonal details panel", function(){
      beforeEach(function(){
        sidebar.open();
        HZApp.Cookies.setItem('hz-sidebar-ad-open', true);
        HZApp.SidebarUtils.updateAccordion(accordion);
        accordion_hide.trigger('click');
      });
      it ("show is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(false);
      });
      it ("hide is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(true);
      });
      it ("cookie is off", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('false');
      });
    });

    describe("should close the additonal details panel", function(){
      beforeEach(function(){
        sidebar.open();
        HZApp.SidebarUtils.updateAccordion(accordion);
        accordion_hide.trigger('click');
      });
      it ("show is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(false);
      });
      it ("hide is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(true);
      });
      it ("cookie is off", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('false');
      });
    });

    describe("should load a closed accordion if the cookie is closed on load", function(){
      beforeEach(function(){
        HZApp.Cookies.setItem('hz-sidebar-ad-open', false);
        HZApp.SidebarUtils.updateAccordion(accordion);
      });
      it ("show is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(false);
      });
      it ("hide is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(true);
      });
      it ("cookie is off", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('false');
      });
    });

    describe("should load a open accordion if the cookie is open on load", function(){
      beforeEach(function(){
        HZApp.Cookies.setItem('hz-sidebar-ad-open', true);
        HZApp.SidebarUtils.updateAccordion(accordion);
      });
      it ("show is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(true);
      });
      it ("hide is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(false);
      });
      it ("cookie is on", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('true');
      });
    });

    describe("should set the cookie accordion state, and bind clicks to accordion", function(){
      beforeEach(function(){
        HZApp.Cookies.setItem('hz-sidebar-ad-open', true);
        HZApp.SidebarUtils.updateAccordion(accordion);
        accordion_hide.trigger('click');
      });
      it ("show is hidden", function(){
        expect(document.querySelector('span.additional-details-expand.show').hidden).toEqual(false);
      });
      it ("hide is not hidden", function(){
        expect(document.querySelector('span.additional-details-expand.hide').hidden).toEqual(true);
      });
      it ("cookie is on", function(){
        expect(HZApp.Cookies.getItem('hz-sidebar-ad-open')).toEqual('false');
      });
    });
  });

  describe("should update the attributes on the qualifications div for the screen reader", function(){
    var hz_elem;
    beforeEach(function(){
      hz_elem  = $('#hubzone-qualifications');
      spyOn(hz_elem, 'focus').and.callThrough();
      HZApp.SidebarUtils.updateA11yFocus(hz_elem);
    });
    it ("should have a aria-rude prop", function(){
      expect(hz_elem.attr('aria-live')).toEqual('rude');
    });
    it ("should have a -1 tabindex", function(){
      expect(hz_elem.attr('tabindex')).toEqual('-1');
    });
    it ("should get focus", function(){
      expect(hz_elem.focus.calls.count()).toEqual(1);
    });
  });

  describe("testing calls out to the router on marker click", function(){
    beforeEach(function(){
      // stub out the Router and updateCenter method since we don't really want it running,
      // but we need to know it exists
      HZApp.Router = {
        updateCenter: function(){ return; }
      };
    });
    it ("should recenter the map on address-marker click to the latlng when provided", function(){
      location.hash = "#center=45.493490,-98.249910&zoom=5&latlng=40.813809,-102.172852";
      spyOn(HZApp.Router, "updateCenter");
      HZApp.SidebarUtils.centerMapMarker({latlng: "40.813809,-102.172852"}, {lat: 40.813809, lng: -102.172852});
      expect(HZApp.Router.updateCenter.calls.count()).toEqual(1);
    });

    it ("should recenter the map on address-marker click to the query geocode when provided", function(){
      location.hash = "#center=45.493490,-98.249910&zoom=5&q=40.813809,-102.172852";
      spyOn(HZApp.Router, "updateCenter");
      HZApp.SidebarUtils.centerMapMarker({q: "40.813809,-102.172852"}, {lat: 40.813809, lng: -102.172852});
      expect(HZApp.Router.updateCenter.calls.count()).toEqual(1);
    });
  });
});
