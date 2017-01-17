/* exported GAs */
HZApp.GA = (function() {

  window.console = window.console || { };
  if ( window.console.log == null ) {
    window.console.log = function() { };
  }

  return {
    timeout: 0,
    url: '', 
    navigateToPage: function(url){
      return document.location = url;
    },
    openLink : function( url, category, action, label, value ) {
      this.url = url;
      // console.log( "GA.openLink: ", url, category, action, label, value );
      if ( typeof ga === "function" ) {
        this.timeout = setTimeout( function() { HZApp.GA.navigateToPage(this.url); }, 500 );
        ga( 'send', 'event', category || "outbound", action || "click", label || this.url, value, {
          hitCallback : function() {
            clearTimeout( this.timeout );
            HZApp.GA.navigateToPage(this.url);
          }
        });
      } else {
        HZApp.GA.navigateToPage(this.url);
      }
    },
    track : function( category, action, label, value ) {
      //console.log( "GA.track: ", category, action, label, value );
      if ( typeof ga === "function" ) {
        ga( "send", "event", category, action, label, value );
      }
    },
    trackSubmit : function(action, inputId) {
      var term = $(inputId).val();
      this.track( 'map', action, term );
    }
  };
})();

