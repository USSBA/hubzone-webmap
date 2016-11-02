var mockData = {
  "type": "FeatureCollection",
  "totalFeatures": 1,
  "features": [{
    "type": "Feature",
    "id": "indianlands_2014.582",
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [-95.942545, 39.37525],
            [-95.942583, 39.375954],
            [-95.942522, 39.374808],
            [-95.942535, 39.37506],
            [-95.942545, 39.37525]
          ]
        ]
      ]
    },
    "geometry_name": "geom",
    "properties": {
      "objectid": 582,
      "id": 1805758,
      "indian": "2057458",
      "name": "Prairie Band of Potawatomi Nation KS"
    }
  }],
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::4326"
    }
  }
};


describe ('Testing map operations', function() {

  it("map loads with properties", function() {
    expect(window.map).toBeDefined();
  });

  it("map has a data object", function() {
    expect(window.map.data).toBeDefined();
  });

  //this one fails because the previous one fails
  it ("map has some data", function(){
    window.map.data.addGeoJson(mockData);;
    var hasData = window.map.data.contains(mockData)
    expect(hasData).toBe(true);
  });
});
