//= require hzmap/sidebar
//= require hzmap/ga
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  beforeEach(function(done) {
    HZApp.SidebarUtils.sidebar = HZSpecHelper.mockPage.build();
    $sidebar = HZApp.SidebarUtils.sidebar;
    setTimeout(function() {
      done();
    }, 1);
  });
  afterEach(function(done) {
    HZApp.SidebarUtils.sidebar = {};
    $sidebar = {};
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  it ("should create a sidebar", function(){
    expect($sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    expect($sidebar.hasClass('hidden')).toBe(true);
  });
  it ("should open and move legend on mobile", function() {
    $sidebar.open();
    expect($sidebar.hasClass('on')).toBe(true);
    expect($('#legend')[0].className).toContain('legend-mobile');
  });
  it ("should close and move legend on mobile", function() {
    $sidebar.close();
    expect($sidebar.hasClass('hidden')).toBe(true);
    expect($('#legend')[0].className).not.toContain('legend-mobile');
  });

  it ("should catch the button click to trigger the sidebar to close", function() {
    $sidebar.open();
    HZApp.SidebarUtils.triggerSidebar();
    expect($sidebar.hasClass('hidden')).toBe(true);
  });

  it ("should catch the button click to trigger the sidebar to open", function() {
    $sidebar.close();
    HZApp.SidebarUtils.triggerSidebar();
    expect($sidebar.hasClass('on')).toBe(true);
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
