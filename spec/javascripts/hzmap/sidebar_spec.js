//= require hzmap
//= require ../helpers/sinon-1.17.6

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

  it ("should call the the triggerAction function", function(){
    var testDiv = document.createElement('div');
    $('#sidebar').append(testDiv)
    $('#sidebar').css('display', 'none');
    var accordion = '<li>' + 
      '<button id="test_button" class="usa-accordion-button" aria-expanded="false" aria-controls="indian_lands">' + 
        'Indian Lands' + 
      '</button>' +
      '<div id="indian_lands" class="usa-accordion-content" aria-hidden="true">' +
        '<p>' +
        '</p><table class="usa-table-borderless hubzone-qualification-details">' +
        '<tbody>' +
          '<tr>' +
            '<th scope="row">Expires</th>' +
            '<td></td>' +
          '</tr>' +
          '</tbody>' +
        '</table' +
        '<p></p>' +
      '</div>' + 
    '</li>';
    $(testDiv).append(accordion);
    updateAccordions();
    $('button.usa-accordion-button').trigger('click');
    expect($('#test_button').attr('aria-expanded')).toEqual("true");
    expect($('#indian_lands').attr('aria-hidden')).toEqual("false");
  });

});
