window.navigator.geolocation = {
    getCurrentPosition: function (success, failure) {
        success({
            coords: {
                // Will always return Germany, Rostock
                latitude: 54.0834,
                longitude: 12.1004

            }, timestamp: Date.now()
        });
    }
};
