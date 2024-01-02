#!/usr/bin/env ruby

require 'nokogiri'
require 'optparse'
require 'ostruct'
require 'byebug'
require 'fileutils'
require 'net/http'
require 'tempfile'
require 'zip'

MAX_RETRIES = 3

def download_directory
  "#{@options.directory}/#{@options.type}_files"
end

# download file and return TempFile
def download_file(url)
  temp_file = Tempfile.new
  uri = URI(url)
  Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
    response = http.get(uri.request_uri)

    if response.is_a?(Net::HTTPSuccess)
      temp_file.write(response.body)
      temp_file.rewind
    else
      temp_file.close!
      raise "Failed to download the file. HTTP status code: #{response.code}"
    end
  end
  temp_file
end

def layer_url(layer_name, type)
  case type
  when 'kml'
    "https://maps.certify.sba.gov/geoserver/wms/kml?layers=#{layer_name}&mode=download"
  when 'shapezip'
    "https://maps.certify.sba.gov/geoserver/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=#{layer_name}&outputFormat=SHAPE-ZIP"
  end
end

def all_layers_downloaded?(layer_names, type)
  layer_names.each do |layer_name|
    ext = type
    ext = 'shape.zip' if type == 'shapezip'
    return false unless File.exist?("#{download_directory}/#{layer_name}.#{ext}")
  end
  true
end

def layers_not_downloaded(layer_names, type)
  missing_layers = []
  layer_names.each do |layer_name|
    ext = type
    ext = 'shape.zip' if type == 'shapezip'
    missing_layers << layer_name unless File.exist?("#{download_directory}/#{layer_name}.#{ext}")
  end
  missing_layers
end

def full_path_for_layer(layer_name, type)
  ext = type
  ext = 'shape.zip' if type == 'shapezip'
  file_name = "#{layer_name}.#{ext}"
  "#{download_directory}/#{file_name}"
end

def unzip_file(zip_file, destination)
  Zip::File.open(zip_file) do |zip_file|
    zip_file.each do |entry|
      entry_destination = File.join(destination, entry.name)
      FileUtils.mkdir_p(File.dirname(entry_destination))
      File.delete(entry_destination) if File.exist?(entry_destination)
      entry.extract(entry_destination)
    end
  end
end

def import_table(layer_file)
  puts "Importing layer_file: #{layer_file.path}"
  input_file = layer_file
  str, table_name = File.basename(layer_file, '.*').split(':')
  table_name.gsub! '.shape', ''
  if @options.type == 'shapezip'
    unzip_dir = "#{download_directory}/#{table_name}"
    FileUtils.mkdir_p unzip_dir
    unzip_file layer_file, unzip_dir
    input_file = Dir.glob(File.join(unzip_dir, '*.shp')).first
  end
  cmd = "ogr2ogr -f 'PostgreSQL' PG:'host=localhost dbname=hzgeo_dev' -nln #{table_name} #{File.expand_path input_file} -overwrite"
  puts "Running: #{cmd}"
  system cmd
end

# set command line option defaults
@options = OpenStruct.new({
    url: 'https://maps.certify.sba.gov/geoserver/ows?service=WFS&version=1.1.0&request=GetCapabilities',
    type: 'shapezip',
    directory: '.'
  })
# parse command line options
OptionParser.new do |opt|
  opt.on('-f', '--file /path/to/file.xml', 'The capabilities XML file') { |o| @options.file = o }
  opt.on('-u', '--url url', 'The capabilities XML file url') { |o| @options.url = o }
  opt.on('-t', '--type [kml | shapezip]', 'The type of downloaded file format. KML or Shape Zip (default) files.') { |o| @options.type = o }
  opt.on('-k', '--skip_download', 'Skip downloading the layer files in case some are missing.') { |o| @options.skip_download = o }
  opt.on('-d', '--directory /dir/path', 'The directory to download to. Default: current directory') { |o| @options.directory = o }
end.parse!

if @options.type == 'kml'
  puts "Using KML Files"
elsif @options.type == 'shapezip'
  puts "Using Shape Zip files"
else
  puts "ERROR: Unknown type #{@options.type}"
  exit 1
end

unless File.directory? download_directory
  FileUtils.mkdir_p download_directory
  puts "Directory '#{download_directory}' created."
end


begin
  # file takes precedence
  if @options.file
    puts "Using #{@options.file}"
    doc = Nokogiri::XML(File.open(@options.file))
  elsif @options.url
    puts "Downloading #{@options.url}"
    doc = Nokogiri::XML(download_file(@options.url))
  end

  successful_downloads = []
  failed_downloads = []

  # get all layer names
  layer_elements = doc.css('FeatureType Name')
  layer_names = layer_elements.map(&:text)

  # download each layer manually from Certify Maps
  unless @options.skip_download
    layer_names.each do |layer_name|

      url = layer_url(layer_name, @options.type)

      full_path = full_path_for_layer(layer_name, @options.type)

      next if File.exist?(full_path)

      uri = URI.parse(url)
      retries = 0
      begin
        http = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https', open_timeout: 30, read_timeout: 120)
        puts "Downloading #{url}"
        response = http.get(uri.request_uri)

        if response.is_a?(Net::HTTPSuccess)
          File.open(full_path, 'w') do |file|
            file.write(response.body)
          end
          puts "File #{url} downloaded successfully."
          successful_downloads << url
          failed_downloads.delete url
        else
          puts "Failed to download the file #{url}. HTTP status code: #{response.code}"
          failed_downloads << url unless failed_downloads.include?(url)
          raise Net::OpenTimeout
        end
      rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED
        retries += 1
        if retries < MAX_RETRIES
          puts "The downlod has timed out. Retrying..."
          sleep 1
          retry
        end
        puts "Download failed for #{url} after #{MAX_RETRIES} retries."
      end
    end
  end

  unless failed_downloads.empty?
    puts "The following URLs failed to download:"
    failed_downloads.each do |failed_download|
      puts failed_download
    end
  end

  if all_layers_downloaded?(layer_names, @options.type)
    puts "All Layer Files Have Been Downloaded to Directory '#{download_directory}'"
  else
    puts
    puts "The following layers have not been downloaded:"
    puts "\t#{layers_not_downloaded(layer_names, @options.type).join("\n\t")}"
    puts
  end

  layer_names.reject {|name| name.include? 'archive' }.each do |layer_name|
    next unless File.exist? full_path_for_layer(layer_name, @options.type)
    layer_file = File.open full_path_for_layer(layer_name, @options.type)
    import_table layer_file
    layer_file.close
  end


rescue Errno::ENOENT
  puts "Error: File '#{@options.file}' not found."
  exit 1

rescue StandardError => e
  puts "An error occurred: #{e.message}"
  exit 1
end

