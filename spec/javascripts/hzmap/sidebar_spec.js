//= require hzmap/sidebar
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  beforeEach(function(done) {
    var sidebar = HZSpecHelper.mockPage.build();
    setTimeout(function() {
      done();
    }, 1);
  });
  afterEach(function(done) {
    HZSpecHelper.mockPage.destroy();
    setTimeout(function() {
      done();
    }, 1);
  });

  it ("should create a sidebar", function(){
    expect(sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    expect(sidebar.currentClass).toEqual('hidden');
  });
  it ("should open and move legend on mobile", function() {
    sidebar.open();
    expect(sidebar.currentClass).toEqual('on');
    expect($('#legend')[0].className).toContain('legend-mobile');
  });
  it ("should close and move legend on mobile", function() {
    sidebar.close();
    expect(sidebar.currentClass).toEqual('hidden');
    expect($('#legend')[0].className).not.toContain('legend-mobile');
  });

  it ("should catch the button click to trigger the sidebar to close", function() {
    sidebar.open();
    triggerSidebar();
    expect(sidebar.currentClass).toEqual('hidden');
  });

  it ("should catch the button click to trigger the sidebar to open", function() {
    sidebar.close();
    triggerSidebar();
    expect(sidebar.currentClass).toEqual('on');
  });
});
