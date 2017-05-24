// cookies read, write, erase methods
//  adapted from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
HZApp.Cookies = (function(){
  return{
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (this.checkKeyName(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) { sExpires = this.setExpiration(vEnd); }
      document.cookie = this.buildNewCookie(sKey, sValue, sExpires, sDomain, sPath, bSecure);
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    },

    // helpers
    buildNewCookie: function(sKey, sValue, sExpires, sDomain, sPath, bSecure){
      return (encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : ""));
    },
    checkKeyName: function(sKey){
      return (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey));
    },
    setExpiration: function(vEnd){
      var vEndType = typeof(vEnd);
      if (vEndType === 'number'){
        return (vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd);
      } else if (vEndType === 'string'){
        return "; expires=" + vEnd;
      } else {
        return "";
      }
    },
  };
})();
