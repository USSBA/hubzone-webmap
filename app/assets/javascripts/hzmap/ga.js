/* exported GAs */
HZApp.GA = (function() {

  window.console = window.console || { };
  if ( window.console.log == null ) {
    window.console.log = function() { };
  }

  return {
    openLink : function( url, category, action, label, value ) {
      //console.log( "GA.openLink: ", url, category, action, label, value );
      if ( typeof ga === "function" ) {
        var timeout = setTimeout( function() { document.location = url; }, 500 );
        ga( 'send', 'event', category || "outbound", action || "click", label || url, value, {
          hitCallback : function() {
            clearTimeout( timeout );
            document.location = url;
          }
        });
      } else {
        document.location = url;
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

