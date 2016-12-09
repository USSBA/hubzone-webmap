/* jshint unused: false */
var hzMapLayerStyle = {
    "indianLands": {
        fillColor: '#377EB8',
        zIndex: 10,
        opacity: 0.75,
        strokeColor: '#377EB8',
        strokeOpacity: 1,
        strokeWeight: 1.25
    },
    "brac_expiring": {
        fillColor: '#377EB8',
        zIndex: 30,
        opacity: 0.75,
        strokeColor: '#377EB8',
        strokeOpacity: 1,
        strokeWeight: 1.25
    },
    "qct": {
        fillColor: '#377EB8',
        zIndex: 20,
        opacity: 0.75,
        strokeColor: '#377EB8',
        strokeOpacity: 1,
        strokeWeight: 1.25
    },
    "qnmc": {
        fillColor: '#377EB8',
        zIndex: 5,
        opacity: 0.75,
        strokeColor: '#377EB8',
        strokeOpacity: 1,
        strokeWeight: 1.25
    },
    "qct_expiring": {
        fillColor: '#000000',
        zIndex: 20,
        opacity: 0.75,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 1.25
    },
    "qnmc_expiring": {
        fillColor: '#000000',
        zIndex: 5,
        opacity: 0.75,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 1.25
    }

};

// define map layer WMS SLD styles
var hz_current_sld = (
   '<?xml version="1.0" encoding="UTF-8"?>' +
   '<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
   '<sld:NamedLayer>' +
   '<sld:Name>hubzone-test:hz_current</sld:Name>' +
   '<sld:UserStyle>' +
   '<sld:FeatureTypeStyle>' +
   '<sld:Rule>' +
   '<sld:PolygonSymbolizer>' +
   '<sld:Fill>' +
   '<sld:CssParameter name="fill">#377EB8</sld:CssParameter>' +
   '<sld:CssParameter name="fill-opacity">0.75</sld:CssParameter>' +
   '</sld:Fill>' +
   '<sld:Stroke>' +
   '<sld:CssParameter name="stroke">#377EB8</sld:CssParameter>' +
   '<sld:CssParameter name="stroke-width">1.25</sld:CssParameter>' +
   '<sld:CssParameter name="stroke-opacity">1</sld:CssParameter>' +
   '</sld:Stroke>' +
   '</sld:PolygonSymbolizer>' +
   '</sld:Rule>' +
   '</sld:FeatureTypeStyle>' +
   '</sld:UserStyle>' +
   '</sld:NamedLayer>' +
   '</sld:StyledLayerDescriptor>'
);

var indian_lands_sld = (
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
  '<sld:NamedLayer>' +
  '<sld:Name>hubzone-test:indian_lands</sld:Name>' +
  '<sld:UserStyle>' +
  '<sld:FeatureTypeStyle>' +
  '<sld:Rule>' +
  '<sld:PolygonSymbolizer>' +
  '<sld:Fill>' +
  '<sld:GraphicFill>' +
  '<sld:Graphic>' +
  '<sld:Mark>' +
  '<sld:WellKnownName>shape://backslash</sld:WellKnownName>' +
  '<sld:Stroke>' +
  '<sld:CssParameter name="stroke">#663399</sld:CssParameter>' +
  '</sld:Stroke>' +
  '</sld:Mark>' +
  '<sld:Size>16</sld:Size>' +
  '</sld:Graphic>' +
  '</sld:GraphicFill>' +
  '</sld:Fill>' +
  '</sld:PolygonSymbolizer>' +
  '</sld:Rule>' +
  '</sld:FeatureTypeStyle>' +
  '</sld:UserStyle>' +
  '</sld:NamedLayer>' +
  '</sld:StyledLayerDescriptor>'
);

var xml_styles = {
  hz_current: encodeURIComponent(hz_current_sld),
  indian_lands: encodeURIComponent(indian_lands_sld)
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
