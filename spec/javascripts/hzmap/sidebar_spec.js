//= require hzmap

describe ('Testing sidebar operations', function() {
  it ("should create a sidebar", function(){
    expect(sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    // expect(sidebar[0].className).toEqual('hidden');
    expect(sidebar).toContain()
  });
  // it ("should open", function() {
  //   sidebar.open();
  //   expect(sidebar[0].className).toEqual('on');
  // });
});
