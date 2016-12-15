
var defaultFillOpacity = 0.5;
var defaultStrokeOpacity = 1;
var defaultStrokeWidth = 1.25;
/* jshint unused: false */
var hzMapLayerStyle = {
  "indian_lands": {
    layer: "indian_lands",
    fillColor: '#984EA3',
    zIndex: 10,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#984EA3',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: false
  },
  "brac": {
    layer: "brac",
    fillColor: '#FF7F00',
    zIndex: 30,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#FF7F00',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  },
  "qct": {
    layer: "qct",
    fillColor: '#4DAF4A',
    zIndex: 20,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#4DAF4A',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  },
  "qnmc": {
    layer: "qnmc",
    fillColor: '#377EB8',
    zIndex: 5,
    fillOpacity: defaultFillOpacity,
    strokeColor: '#377EB8',
    strokeOpacity: defaultStrokeOpacity,
    strokeWidth: defaultStrokeWidth,
    styleExpiring: true
  }
};

var hzBaseMapStyle = [
  {
    "featureType": "administrative.province",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "saturation": "-82"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "hue": "#ff0000"
      },
      {
        "saturation": "-0"
      },
      {
        "lightness": "20"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "hue": "#0071ff"
      },
      {
        "saturation": "-100"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "hue": "#ff0000"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 51
      },
      {
        "visibility": "simplified"
      },
      {
        "hue": "#ff0000"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#e7f4e3"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 30
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 40
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": -25
      },
      {
        "saturation": -97
      },
      {
        "color": "#aeb0b5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": -25
      },
      {
        "saturation": -100
      }
    ]
  }
];
