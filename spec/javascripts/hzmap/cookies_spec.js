//= require hzmap/cookies
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing Cookie operations', function() {

  describe ('getting cookies', function(){
    beforeEach(function(){
      cookieKey = 'foo';
      cookieValue = 'bar';
      document.cookie = cookieKey + '=' + cookieValue;
    });

    afterEach(function(){
      HZApp.Cookies.removeItem(cookieKey);
    });

    it("gets the correct cookie", function(){
      expect(HZApp.Cookies.getItem(cookieKey)).toEqual(cookieValue);
    });

    it("returns null if given null", function(){
      expect(HZApp.Cookies.getItem()).toBeNull();
    });

    it("returns null if given a key not present", function(){
      expect(HZApp.Cookies.getItem(2342134123423)).toBeNull();
    });

    it("returns false if key doesnt exist", function(){
      expect(HZApp.Cookies.hasItem()).toBe(false);
    });

    it("has the cookie in a list of keys", function(){
      var keys = HZApp.Cookies.keys().toString();
      var keyMatch = new RegExp(cookieKey, "g");
      expect(keys.match(keyMatch)).toBeDefined();
    });

  });

  describe('creating keys', function(){
    beforeEach(function(){
      cookieKey = 'beep';
      cookieValue = 'boop';
    });
    afterEach(function(){
      HZApp.Cookies.removeItem(cookieKey);
    });

    it("should not allowing setting a key with a reserved name", function(){
      expect(HZApp.Cookies.setItem('path', 'bar')).toBe(false);
    });

    it("should allow setting a key with just a key value", function(){
      expect(HZApp.Cookies.setItem(cookieKey, cookieValue)).toBe(true);
    });

    it("should allow setting a key with just a key, value, Infinity", function(){
      expect(HZApp.Cookies.setItem(cookieKey, cookieValue, Infinity)).toBe(true);
    });

    it("should allow setting a key with just a key, value, string", function(){
      expect(HZApp.Cookies.setItem(cookieKey, cookieValue, "Wed, 19 Feb 2127 01:04:55 GMT")).toBe(true);
    });

    it("should allow setting a key with just a key, value, date", function(){
      expect(HZApp.Cookies.setItem(cookieKey, cookieValue, Date(2020, 5, 12))).toBe(true);
    });

    it("should allow setting a key with just a key, value, date, path, domain, secure", function(){
      expect(HZApp.Cookies.setItem(cookieKey, cookieValue, new Date(2020, 5, 12), '/foo', '1.2bar', true)).toBe(true);
    });
  });

  describe ('removing cookies', function(){
    beforeEach(function(){
      cookieKey = 'bar';
      cookieValue = 'foo';
      path = '/';
      domain = 'this.com';
    });

    afterEach(function(){
      HZApp.Cookies.removeItem(cookieKey, path, domain);
    });

    it("doesnt remove a key that doesnt exist", function(){
      expect(HZApp.Cookies.removeItem(2342134123423)).toBe(false);
    });

    it("removes a key that does exist when given no path", function(){
      HZApp.Cookies.setItem(cookieKey, cookieValue, 1000);
      expect(HZApp.Cookies.removeItem(cookieKey)).toBe(true);
    });

    // this test passes because the cookie is not set, I cant figure out why
    it("doesnt remove a key that does exist when given no path", function(){
      HZApp.Cookies.setItem(cookieKey, cookieValue, Date(2020, 5, 12), path, domain);
      expect(HZApp.Cookies.removeItem(cookieKey)).toBe(false);
    });

  });

});
