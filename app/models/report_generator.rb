require 'csv'
require 'open-uri'
require 'prawn'

class ReportGenerator
  attr_accessor :pdf, :page_number

  def new_document(filename)
    @pdf = Prawn::Document.new
    @page_number = 1
    add_header
    add_map
    add_report
    footer
    pdf.render_file filename
  end

  def add_header
    pdf.font_size 24
    pdf.text "HUBZone Report"
    pdf.font_size 12
    pdf.move_down 10
  end

  def add_map
    region = baltimore
    bbox = WmsUtil.lat_lng_to_bbox(region[:lat], region[:lng], region[:zoom],
                                   width, height)

    y_position = pdf.cursor

    base_map_url =  WmsUtil.google_static( {
                                   center: { lat: region[:lat], lng: region[:lng]},
                                   width: width,
                                   height: height,
                                   scale: 1,
                                   zoom: region[:zoom] } )
    pdf.image open(base_map_url), at: [0, y_position], width: 512, height: 512

    qct_url = WmsUtil.build_wms_url( { bbox: bbox.join(','),
                                   width: width * scale,
                                   height: height * scale,
                                   layer: :qct } )
    qnmc_url = WmsUtil.build_wms_url( { bbox: bbox.join(','),
                                   width: width * scale,
                                   height: height * scale,
                                   layer: :qnmc } )
    indian_lands_url = WmsUtil.build_wms_url( { bbox: bbox.join(','),
                                   width: width * scale,
                                   height: height * scale,
                                   layer: :indian_lands } )

    pdf.image open(indian_lands_url), at: [0, y_position], width: 512, height: 512
    pdf.image open(qnmc_url), at: [0, y_position], width: 512, height: 512
    pdf.image open(qct_url), at: [0, y_position], width: 512, height: 512

    pdf.move_down 542
  end

  def add_report
    headers = addresses.headers
    render_header headers
    addresses.each do |a|
      render_row a, headers
    end
  end

  def footer
    pdf.font "Helvetica", style: :italic
    pdf.font_size 8

    color = "aaaaaa"

    pdf.stroke_color color
    pdf.stroke_line [0,0], [535, 0]

    pdf.draw_text "SBA HUBZone Report", at: [0, -12], color: color
    pdf.draw_text "Page #{page_number}", at: [500, -12], color: color

    pdf.font "Helvetica", style: :normal
    pdf.font_size 12
  end

  private

  def render_header(headers)
    pdf.font_size 16
    pdf.font "Courier", style: :bold

    y_position = pdf.cursor
    pdf.draw_text "Address", at: [0, y_position]
    pdf.draw_text "Latitude", at: [300, y_position]
    pdf.draw_text "Longitude", at: [400, y_position]

    pdf.font_size 12
    pdf.font "Helvetica", style: :normal
    pdf.move_down 20
  end

  def render_row(row, headers)
    table_new_page(headers) if pdf.cursor < 12

    pdf.font "Courier", style: :bold
    pdf.font_size 10
    y_position = pdf.cursor
    pdf.text_box row['Address'], at: [  0, y_position],
                                 width: 290, height: 15,
                                 overflow: :shrink_to_fit,
                                 min_font_size: 6
    pdf.text_box row['Lat'],     at: [300, y_position],
                                 width: 90,  height: 15,
                                 overflow: :shrink_to_fit
    pdf.text_box row['Long'],    at: [400, y_position],
                                 width: 90,  height: 15,
                                 overflow: :shrink_to_fit
    pdf.move_down 15
    pdf.font "Helvetica", style: :normal
    pdf.font_size 12
  end

  def table_new_page(headers)
    footer
    pdf.start_new_page
    @page_number = @page_number + 1
    render_header headers
  end

  def addresses
    return @addresses unless @addresses.nil?

    import_file = Rails.root.join('public/data/baltimore-addresses-geocoded.csv')
    import_text = File.read(import_file)
    @addresses = CSV.parse(import_text, headers: true)
  end


  def usa
    { lat: 37.09024,
      lng: -95.44922,
      zoom: 3
    }
  end

  def baltimore
    { lat: 39.2877114,
      lng: -76.6107718,
      zoom: 12
    }
  end

  def width
    512
  end

  def height
    512
  end

  def scale
    1
  end
end
