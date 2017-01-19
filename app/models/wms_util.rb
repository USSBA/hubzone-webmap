class WmsUtil

  def self.build_wms_url(options)
    url = MAP_CONFIG[:geom_wms_settings][:url_root]
    url += "&REQUEST=GetMap"
    url += "&SERVICE=WMS"
    url += "&VERSION=1.1.0"
    url += "&LAYERS=hubzone:" + options[:layer].to_s
    url += "&FORMAT=image/png"
    url += "&TRANSPARENT=TRUE"
    url += "&SRS=EPSG:900913"
    url += "&BBOX=" + options[:bbox]
    url += "&WIDTH=" + options[:width].to_s
    url += "&HEIGHT=" + options[:height].to_s
    url += "&" + styles[options[:layer]]
    url
  end

  def self.google_static(options)
    staticMap = "https://maps.googleapis.com/maps/api/staticmap"
    staticMap += "?center=" + options[:center][:lat].to_s + "," + options[:center][:lng].to_s
    staticMap += "&zoom=" + options[:zoom].to_s
    staticMap += "&size=" + options[:width].to_s + "x" + options[:height].to_s
    staticMap += "&scale=" + options[:scale].to_s
    staticMap += "&maptype=roadmap"
    staticMap += "&key=#{MAP_CONFIG[:google_api_key]}"
    staticMap
  end

  def self.get_tile_number(lat, lng, zoom)
    n = 2 ** zoom
    xtile = (n * (lng + 180.0) / 360.0)
    lat_rad = radians(lat)
    ytile = ((1.0 - Math.log(Math.tan(lat_rad) + sec(lat_rad) ) / Math::PI) / 2.0 * n)
    [xtile, ytile]
  end

  def self.tile_to_lng(xtile, zoom)
    n = 2 ** zoom
    xtile / n * 360.0 - 180.0
  end

  def self.tile_to_lat(ytile, zoom)
    n = 2 ** zoom
    degrees( Math.atan( Math.sinh( Math::PI * (1 - (2 * ytile / n)) ) ) )
  end

  def self.lat_lng_to_bbox(lat, lng, zoom, width, height, tile_size = 256)
    tileNumbers = get_tile_number(lat, lng, zoom)
    xtile_w = (tileNumbers[0] * tile_size - (width/2)) / tile_size
    xtile_e = (tileNumbers[0] * tile_size + (width/2)) / tile_size
    ytile_s = (tileNumbers[1] * tile_size + (height/2)) / tile_size
    ytile_n = (tileNumbers[1] * tile_size - (height/2)) / tile_size
    w = tile_to_lng(xtile_w, zoom)
    s = tile_to_lat(ytile_s, zoom)
    e = tile_to_lng(xtile_e, zoom)
    n = tile_to_lat(ytile_n, zoom)
    webMSW = to_web_mercator(w, s)
    webMNE = to_web_mercator(e, n)
    [webMSW[0], webMSW[1], webMNE[0], webMNE[1]]
  end

  # math helpers

  def self.to_web_mercator(xLon, yLat)
    if ((abs(xLon) > 180) && (abs(yLat) > 90))
      # coordinate out of range
      nil
    else
      semimajorAxis = 6378137.0
      east = xLon * 0.017453292519943295
      north = yLat * 0.017453292519943295
      northing = 3189068.5 * Math.log((1.0 + Math.sin(north)) / (1.0 - Math.sin(north)))
      easting = semimajorAxis * east
      [easting, northing]
    end
  end

  def self.radians(angle)
    angle * Math::PI / 180.0
  end

  def self.degrees(angle)
    angle * 180.0 / Math::PI
  end

  def self.sec(x)
    1 / Math.cos(x)
  end

  def self.abs(x)
    x if x >= 0
    x * -1
  end

  def self.styles
    { indian_lands: "SLD_BODY=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20version%3D%221.0.0%22%20xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%20StyledLayerDescriptor.xsd%22%3E%3CNamedLayer%3E%3CName%3Ehubzone%3Aindian_lands%3C%2FName%3E%3CUserStyle%3E%3CFeatureTypeStyle%3E%3CRule%3E%3CName%3Enot%20expiring%3C%2FName%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CCssParameter%20name%3D%22fill%22%3E%23984EA3%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22fill-opacity%22%3E0.5%3C%2FCssParameter%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%23984EA3%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3C%2FFeatureTypeStyle%3E%3C%2FUserStyle%3E%3C%2FNamedLayer%3E%3C%2FStyledLayerDescriptor%3E",
      qct: "SLD_BODY=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20version%3D%221.0.0%22%20xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%20StyledLayerDescriptor.xsd%22%3E%3CNamedLayer%3E%3CName%3Ehubzone%3Aqct%3C%2FName%3E%3CUserStyle%3E%3CFeatureTypeStyle%3E%3CRule%3E%3CName%3Enot%20expiring%3C%2FName%3E%3Cogc%3AFilter%3E%3Cogc%3APropertyIsEqualTo%3E%3Cogc%3AFunction%20name%3D%22isNull%22%3E%3Cogc%3APropertyName%3Eexpires%3C%2Fogc%3APropertyName%3E%3C%2Fogc%3AFunction%3E%3Cogc%3ALiteral%3Etrue%3C%2Fogc%3ALiteral%3E%3C%2Fogc%3APropertyIsEqualTo%3E%3C%2Fogc%3AFilter%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CCssParameter%20name%3D%22fill%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22fill-opacity%22%3E0.5%3C%2FCssParameter%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3CRule%3E%3CName%3Eexpiring%3C%2FName%3E%3Cogc%3AFilter%3E%3Cogc%3APropertyIsEqualTo%3E%3Cogc%3AFunction%20name%3D%22isNull%22%3E%3Cogc%3APropertyName%3Eexpires%3C%2Fogc%3APropertyName%3E%3C%2Fogc%3AFunction%3E%3Cogc%3ALiteral%3Efalse%3C%2Fogc%3ALiteral%3E%3C%2Fogc%3APropertyIsEqualTo%3E%3C%2Fogc%3AFilter%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CGraphicFill%3E%3CGraphic%3E%3CMark%3E%3CWellKnownName%3Eshape%3A%2F%2Fbackslash%3C%2FWellKnownName%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FMark%3E%3CSize%3E16%3C%2FSize%3E%3C%2FGraphic%3E%3C%2FGraphicFill%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%234DAF4A%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3C%2FFeatureTypeStyle%3E%3C%2FUserStyle%3E%3C%2FNamedLayer%3E%3C%2FStyledLayerDescriptor%3E",
      qnmc: "SLD_BODY=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20version%3D%221.0.0%22%20xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%20StyledLayerDescriptor.xsd%22%3E%3CNamedLayer%3E%3CName%3Ehubzone%3Aqnmc%3C%2FName%3E%3CUserStyle%3E%3CFeatureTypeStyle%3E%3CRule%3E%3CName%3Enot%20expiring%3C%2FName%3E%3Cogc%3AFilter%3E%3Cogc%3APropertyIsEqualTo%3E%3Cogc%3AFunction%20name%3D%22isNull%22%3E%3Cogc%3APropertyName%3Eexpires%3C%2Fogc%3APropertyName%3E%3C%2Fogc%3AFunction%3E%3Cogc%3ALiteral%3Etrue%3C%2Fogc%3ALiteral%3E%3C%2Fogc%3APropertyIsEqualTo%3E%3C%2Fogc%3AFilter%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CCssParameter%20name%3D%22fill%22%3E%23377EB8%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22fill-opacity%22%3E0.5%3C%2FCssParameter%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%23377EB8%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3CRule%3E%3CName%3Eexpiring%3C%2FName%3E%3Cogc%3AFilter%3E%3Cogc%3APropertyIsEqualTo%3E%3Cogc%3AFunction%20name%3D%22isNull%22%3E%3Cogc%3APropertyName%3Eexpires%3C%2Fogc%3APropertyName%3E%3C%2Fogc%3AFunction%3E%3Cogc%3ALiteral%3Efalse%3C%2Fogc%3ALiteral%3E%3C%2Fogc%3APropertyIsEqualTo%3E%3C%2Fogc%3AFilter%3E%3CPolygonSymbolizer%3E%3CFill%3E%3CGraphicFill%3E%3CGraphic%3E%3CMark%3E%3CWellKnownName%3Eshape%3A%2F%2Fbackslash%3C%2FWellKnownName%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%23377EB8%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FMark%3E%3CSize%3E16%3C%2FSize%3E%3C%2FGraphic%3E%3C%2FGraphicFill%3E%3C%2FFill%3E%3CStroke%3E%3CCssParameter%20name%3D%22stroke%22%3E%23377EB8%3C%2FCssParameter%3E%3CCssParameter%20name%3D%22stroke-width%22%3E1.25%3C%2FCssParameter%3E%3C%2FStroke%3E%3C%2FPolygonSymbolizer%3E%3C%2FRule%3E%3C%2FFeatureTypeStyle%3E%3C%2FUserStyle%3E%3C%2FNamedLayer%3E%3C%2FStyledLayerDescriptor%3E" }
  end

end
