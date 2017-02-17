//= require hzmap/hz-query
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing hz-query functions', function() {
  beforeEach(function(){
    google = HZSpecHelper.google;
    HZSpecHelper.mockPage.build();
    HZApp.map = new google.maps.Map();

  });

  afterEach(function(){
    HZApp.map = {};
    HZSpecHelper.mockPage.destroy();
  });


});
