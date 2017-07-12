// reporting utility
HZApp.Report = (function(){
  //adds listeners
  $(function() {
    $(document).bind("keydown", HZApp.Report.catchKeyStrokeToPrint);
    $(document).on('click','#map-report', HZApp.Report.requestReport);
  });

  return {

    reportURL: null,
    defaultRequestType: null,

    catchKeyStrokeToPrint: function(e){
      if((e.ctrlKey || e.metaKey) && e.keyCode === 80){
        e.preventDefault();
        HZApp.Report.requestReport();
      } else {
        return;
      }
    },

    requestReport: function(event, request_type_arg) {  // fetch the app state to send off to the report
      HZApp.HZQuery.query.zoom = HZApp.map.getZoom();

      var url = HZApp.Report.reportURL;
      url += HZApp.Report.getReportRequestParams(HZApp.HZQuery.query);

      var request_type = request_type_arg || HZApp.Report.defaultRequestType;

      if (request_type === "window_open"){
        window.open(url, '_blank');
      } else {
        var req = new XMLHttpRequest();
        HZApp.Report.buildAndRunRequest(req, url);
      }
    },
    buildAndRunRequest: function(req, url){
      HZApp.Report.showReportWaiting();
      req.open("GET", url, true);
      req.responseType = "blob";
      req.onerror = HZApp.Report.requestReportError;
      req.onload = HZApp.Report.handleReportResponse;
      req.send();
    },
    handleReportResponse: function handleReportResponse(event){
      HZApp.Report.hideReportWaiting();
      var link = HZApp.Report.generateDownloadLink(event.currentTarget.response);
      HZApp.Report.downloadReport(link);
    },
    generateDownloadLink: function(blob){
      var link = document.createElement('a');
      link.target = '_blank';
      link.href = window.URL.createObjectURL(blob);
      link.download = ("hz_report" + "_address_" +
                       HZApp.HZQuery.query.q.replace(' ', '_') + ".pdf");
      return link;
    },
    downloadReport: function(link){
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    //takes a hzQuery object as input and parses it for a report GET
    getReportRequestParams:function(hzQuery){
      var params = "";
      params += "?latlng=" + encodeURIComponent(hzQuery.latlng);
      params.zoom = hzQuery.zoom;
      if (hzQuery.q){
        params += "&q=" + encodeURIComponent(hzQuery.q);
      }
      params += "&zoom=" + hzQuery.zoom;
      params += "&locale=" + (document.documentElement.lang || "en");

      return params;
    },
    requestReportError: function requestReportError(){

      $('#report-waiting').html(I18n.t('report.error'));
      HZApp.Report.clearReportWaiting(7500);
    },
    showReportWaiting: function(){
      $('#report-waiting').html(I18n.t('report.generating'));
      $('#report-waiting').show();
    },
    hideReportWaiting: function(){
      $('#report-waiting').html(I18n.t('report.created'));
      HZApp.Report.clearReportWaiting(5000);
    },
    clearReportWaiting: function(timeout){
      setTimeout(function(){
        $('#report-waiting').html();
        $('#report-waiting').hide();
      }, timeout);
    }
  };
})();
