//= require hzmap/report
//= require ../helpers/sinon-1.17.6
//= require ../helpers/hz-jasmine
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing report operations', function() {
  
  describe('catchKeyStrokeToPrint', function(){  
    it ("should trigger requestReport on ctrl-p", function(){
      var printE = HZSpecHelper.mockKeyEvent(true, false, 80);

      spyOn(HZApp.Report, 'requestReport');
      spyOn(printE, 'preventDefault');

      HZApp.Report.catchKeyStrokeToPrint(printE);
      expect(HZApp.Report.requestReport.calls.count()).toEqual(1);
      expect(printE.preventDefault.calls.count()).toEqual(1);
    });

    it ("should trigger requestReport on cmd-p", function(){
      var printE = HZSpecHelper.mockKeyEvent(false, true, 80);
      
      spyOn(HZApp.Report, 'requestReport');
      spyOn(printE, 'preventDefault');

      HZApp.Report.catchKeyStrokeToPrint(printE);
      expect(HZApp.Report.requestReport.calls.count()).toEqual(1);
      expect(printE.preventDefault.calls.count()).toEqual(1);
    });

    it ("should do nothing on other key strokes", function(){
      var printE = HZSpecHelper.mockKeyEvent(false, false, 80);
      
      spyOn(HZApp.Report, 'requestReport');
      spyOn(printE, 'preventDefault');

      HZApp.Report.catchKeyStrokeToPrint(printE);
      expect(HZApp.Report.requestReport.calls.count()).toEqual(0);
      expect(printE.preventDefault.calls.count()).toEqual(0);
    });
  });

  describe ('request response handling', function(){
    
    beforeEach(function(){
      HZSpecHelper.mockPage.build();
      $('#sidebar').append((
        '<div class="sidebar-card map-print">' + 
          '<div id="map-print">' +
            '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>' +
          '</div>' +
          '<span id="report-waiting"></span>' + 
        '</div>')
      );
    });

    afterEach(function(){
      HZSpecHelper.mockPage.destroy();
    });

    it ('should show text while getting a report', function(){
      HZApp.Report.showReportWaiting();
      expect($('#report-waiting').html()).toEqual('Generating Report...');
      expect($('#report-waiting').css('display')).not.toEqual('none');
    });

    it ('should show a prompt then clear the text when a report is done', function(){
      spyOn(HZApp.Report, 'clearReportWaiting');
      HZApp.Report.hideReportWaiting();
      expect($('#report-waiting').html()).toEqual('Report Created');
      expect(HZApp.Report.clearReportWaiting.calls.count()).toEqual(1);
    });

    it ('should clear the text when a report is done', function(){
      spyOn(window, 'setTimeout').and.callFake(function(fn){
       fn.apply(null, arguments);
        return;
      });
      HZApp.Report.clearReportWaiting();
      expect($('#report-waiting').html()).toEqual('');
      expect($('#report-waiting').css('display')).toEqual('none');
    });

    it ('should show a prompt then clear the text when an error is found', function(){
      spyOn(HZApp.Report, 'clearReportWaiting');
      HZApp.Report.requestReportError();
      expect($('#report-waiting').html()).toEqual('Error Generating Report');
      expect(HZApp.Report.clearReportWaiting.calls.count()).toEqual(1);
    });


  });
});
