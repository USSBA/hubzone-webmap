//= require hzmap/sidebar
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  beforeEach(function(done) {
    HZApp.SidebarUtils.sidebar = HZSpecHelper.mockPage.build();
    setTimeout(function() {
      done();
    }, 1);
  });
  afterEach(function(done) {
    HZApp.SidebarUtils.sidebar = {};
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  it ("should create a sidebar", function(){
    expect(HZApp.SidebarUtils.sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    expect(HZApp.SidebarUtils.sidebar.currentClass).toEqual('hidden');
  });
  it ("should open and move legend on mobile", function() {
    HZApp.SidebarUtils.sidebar.open();
    expect(HZApp.SidebarUtils.sidebar.currentClass).toEqual('on');
    expect($('#legend')[0].className).toContain('legend-mobile');
  });
  it ("should close and move legend on mobile", function() {
    HZApp.SidebarUtils.sidebar.close();
    expect(HZApp.SidebarUtils.sidebar.currentClass).toEqual('hidden');
    expect($('#legend')[0].className).not.toContain('legend-mobile');
  });

  it ("should catch the button click to trigger the sidebar to close", function() {
    HZApp.SidebarUtils.sidebar.open();
    HZApp.SidebarUtils.triggerSidebar();
    expect(HZApp.SidebarUtils.sidebar.currentClass).toEqual('hidden');
  });

  it ("should catch the button click to trigger the sidebar to open", function() {
    HZApp.SidebarUtils.sidebar.close();
    HZApp.SidebarUtils.triggerSidebar();
    expect(HZApp.SidebarUtils.sidebar.currentClass).toEqual('on');
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
