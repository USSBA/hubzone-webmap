//= require hzmap
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing sidebar operations', function() {
  console.log('run sidebar specs');
  beforeEach(function(done) {
    var sidebar = mockPage.build();
    setTimeout(function() {
      done();
    }, 1);
  });
  afterEach(function(done) {
    mockPage.destroy();
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

  it ("should call the the triggerAction function", function(){
    $('button.usa-accordion-button').trigger('click');
    expect($('#test_button').attr('aria-expanded')).toEqual("true");
    expect($('#indian_lands').attr('aria-hidden')).toEqual("false");
  });

});
