//= require hzmap/report
//= require hzmap/hz-query
//= require hzmap
//= require i18n/translations
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

  describe('requestReport', function(){
    beforeEach(function(){
      google = HZSpecHelper.google;
      HZApp.map = new google.maps.Map();
      HZApp.HZQuery.query = {
        latlng: '45,-108',
        q: "Banana Shire Way, Rocky Top, USA",
        zoom: 15
      };
    });

    it ('should prepare the correct XMLHttpRequest', function(){
      spyOn(HZApp.Report, 'getReportRequestParams');
      spyOn(HZApp.map, 'getZoom');
      spyOn(HZApp.Report, 'buildAndRunRequest');
      spyOn(window, 'XMLHttpRequest');

      HZApp.Report.requestReport({}, "ajax_get");
      expect(HZApp.Report.getReportRequestParams.calls.count()).toEqual(1);
      expect(HZApp.Report.buildAndRunRequest.calls.count()).toEqual(1);
      expect(HZApp.map.getZoom.calls.count()).toEqual(1);
      expect(window.XMLHttpRequest.calls.count()).toEqual(1);
    });

    it ('should simply open the window with the url if needed', function(){
      spyOn(HZApp.Report, 'getReportRequestParams');
      spyOn(HZApp.map, 'getZoom');
      spyOn(HZApp.Report, 'buildAndRunRequest');
      spyOn(window, 'XMLHttpRequest');
      spyOn(window, 'open');

      HZApp.Report.requestReport({}, 'window_open');
      expect(HZApp.Report.getReportRequestParams.calls.count()).toEqual(1);
      expect(HZApp.Report.buildAndRunRequest.calls.count()).toEqual(0);
      expect(HZApp.map.getZoom.calls.count()).toEqual(1);
      expect(window.XMLHttpRequest.calls.count()).toEqual(0);
      expect(window.open.calls.count()).toEqual(1);
    });

    it ('should run the correct XMLHttpRequest', function(){
      spyOn(HZApp.Report, 'showReportWaiting');
      var url = 'blah';
      var req = new XMLHttpRequest();
      spyOn(req, 'open');
      spyOn(req, 'send');
      HZApp.Report.buildAndRunRequest(req, url);
      expect(req.open.calls.count()).toEqual(1);
      expect(req.send.calls.count()).toEqual(1);
      expect(req.onerror.name).toEqual('requestReportError');
      expect(req.onload.name).toEqual('handleReportResponse');
      expect(HZApp.Report.showReportWaiting.calls.count()).toEqual(1);
    });
  });

  describe ('getReportRequestParams', function(){
    beforeEach(function(){
      google = HZSpecHelper.google;
      HZApp.map = new google.maps.Map();
    });

    afterEach(function(){
      HZApp.map = {};
      google = {};
    });

    it ('should form the correct url param string', function(){
      var mockHZQuery = {
        query: {
          latlng: '45,-108',
          q: "Banana Shire Way, Rocky Top, USA",
          zoom: 15
        }
      };
      var params = HZApp.Report.getReportRequestParams(mockHZQuery.query);
      var expected = ("?latlng=" + encodeURIComponent(mockHZQuery.query.latlng) +
                      "&q=" + encodeURIComponent(mockHZQuery.query.q) +
                      "&zoom=" + mockHZQuery.query.zoom +
                      "&locale=" + (document.documentElement.lang || 'en'));
      expect(params).toEqual(expected);
    });
  });

  describe ('report download callback', function(){
    beforeEach(function(){
      HZApp.HZQuery.query = {
        latlng: '45,-108',
        q: "Banana Shire Way, Rocky Top, USA",
        zoom: 15
      };

      mockResponse = {
        currentTarget: {
          response: new Blob([""], {type: 'application/pdf'})
        }
      };

      fakeLinkDiv = document.createElement('div');
    });

    afterEach(function(){
      fakeLinkDiv.remove();
    });

    it ('generateDownloadLink should generate the correct download link from a response object', function(){
      spyOn(window.URL, 'createObjectURL');
      var downloadLink = HZApp.Report.generateDownloadLink(mockResponse.currentTarget.response);
      var expectedLink = ('<a target="_blank"' +
                          ' href=""' +
                          ' download="hz_report_address_' + HZApp.HZQuery.query.q.replace(' ', '_') + '.pdf"' +
                          '></a>');
      fakeLinkDiv.innerHTML = expectedLink;

      expect(downloadLink.download).toEqual(fakeLinkDiv.firstChild.download);
      expect(downloadLink.target).toEqual(fakeLinkDiv.firstChild.target);
      expect(window.URL.createObjectURL.calls.count()).toEqual(1);
    });

    it('downloadReport should click and then revoke a link', function(){
      spyOn(window.URL, 'revokeObjectURL');
      var downloadLink = HZApp.Report.generateDownloadLink(mockResponse.currentTarget.response);
      spyOn(downloadLink, 'click');

      HZApp.Report.downloadReport(downloadLink);
      expect(downloadLink.click.calls.count()).toEqual(1);
      expect(window.URL.revokeObjectURL.calls.allArgs()[0][0]).toEqual(downloadLink.href);
    });

    it ('handleReportResponse should be called with the response event', function(){
      spyOn(HZApp.Report, 'hideReportWaiting');
      spyOn(HZApp.Report, 'generateDownloadLink');
      spyOn(HZApp.Report, 'downloadReport');

      HZApp.Report.handleReportResponse(mockResponse);
      expect(HZApp.Report.hideReportWaiting.calls.count()).toEqual(1);
      expect(HZApp.Report.generateDownloadLink.calls.allArgs()[0][0]).toEqual(mockResponse.currentTarget.response);
      expect(HZApp.Report.downloadReport.calls.count()).toEqual(1);
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
