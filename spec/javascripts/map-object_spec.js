describe ('Testing map operations', function() {
  beforeEach(function(){
    var jasmineContent = document.getElementById('jasmine_content');
    var testSection = document.createElement('section');
    testSection.addClass('map-body');
    testSection.id('testSection');
    jasmineContent.appendChild(testSection);
    console.log()
  });

  afterEach(function(){
    var elem = document.getElementById('testSection');
    elem.parentNode.removeChild(elem);
  });

  // it("map loads with properties", function() {
  //   var map = pageLoad({
  //     callbackFn: 'initMap'
  //   });
  //   expect(map).toBeDefined();
  //});

  it ("a map-body exists", function(){
    var mapBody = document.querySelector('section.map-body');
    expect(mapBody).toBeDefined();
  });

});
