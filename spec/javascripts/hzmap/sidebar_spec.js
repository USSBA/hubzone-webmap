//= require hzmap

describe ('Testing sidebar operations', function() {
  beforeAll(function(done) {
    $('#sidebar').remove();
    $('body').append('<div id="sidebar" class="hidden"></div>');
    sidebar = $('#sidebar').sidebar();
    done();
  });

  beforeEach(function(done) {
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
  it ("should open", function() {
    sidebar.open();
    expect(sidebar.currentClass).toEqual('on');
  });
  it ("should close", function() {
    sidebar.close();
    expect(sidebar.currentClass).toEqual('hidden');
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
