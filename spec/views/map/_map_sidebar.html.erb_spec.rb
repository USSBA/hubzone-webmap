require "rails_helper"

RSpec.describe "map/_map_sidebar.html.erb" do
  it "displays the sidebar" do
    # assign(:index, build(:index, url: 'http://example.com'))
    # body = "thing"
    # body ={
    #   qualified_single: {
    #     search: 'navajo',
    #     response: {
    #       formatted_address: 'Yup',
    #       http_status: 200,
    #       hubzone: [
    #         {
    #           hz_type: "indian_lands",
    #           expires: nil,
    #           name: "Navajo Nation AZ",
    #           census: "042430R",
    #           type: "Reservation",
    #           class: "American Indian Area",
    #           gnis: "42999"
    #         }
    #       ],
    #       geometry: {
    #         location: {
    #           lat: 0,
    #           lng: 0
    #         }
    #       },
    #       query_date: '2017-04-18'
    #     },
    #     status: "hubzone_assertions.qualified"
    #   }
    # }
    body = {
      address_components: [
        {
          long_name: "8",
          short_name: "8",
          types: ["street_number"]
        },
        {
          long_name: "Market Place",
          short_name: "Market Pl",
          types: ["route"]
        },
        {
          long_name: "Downtown",
          short_name: "Downtown",
          types: ["neighborhood", "political"]
        },
        {
          long_name: "Baltimore",
          short_name: "Baltimore",
          types: ["locality", "political"]
        },
        {
          long_name: "Maryland",
          short_name: "MD",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "21202",
          short_name: "21202",
          types: ["postal_code"]
        }
      ],
      formatted_address: "8 Market Pl, Baltimore, MD 21202, USA",
      geometry: {
        location: {
              lat: 39.2888915,
              lng: -76.6069962
            },
            location_type: "ROOFTOP",
            viewport: {
              northeast: {
                lat: 39.29024048029149,
                lng: -76.60564721970849
              },
              southwest: {
                lat: 39.2875425197085,
                lng: -76.6083451802915
              }
            }
          },
          place_id: "ChIJPTD_Lp0EyIkRqSc4JiwiQTc",
          types: ["street_address"],
          http_status: 200,
          hubzone: [
            {
              gid: 33232,
              tract_fips: "24510040100",
              county: "Baltimore city",
              state: "MD",
              omb_delineation: "Metropolitan",
              prior_status: "Qualified",
              current_status: "Qualified",
              status_change: false,
              redesignated: false,
              expires: nil,
              effective: "2017-01-01",
              hz_type: "qct_e"
            }
          ],
          until_date: nil,
          query_date: "2017-07-11",
          search_q: "8 Market Place, Baltimore, MD, United States",
          search_latlng: nil,
          api_version: 1
        }
    # stub(view).render partial: 'map/additional_details/indian_lands' #, locals: {body: body}
    render partial: "map/map_sidebar", locals: {body: body}
    puts rendered
    # expect(rendered).to have_content("Yup")
    expect(rendered).to have_content("24510040100")
  end
end
