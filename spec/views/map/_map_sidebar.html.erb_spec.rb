require "rails_helper"

#rubocop:disable Metrics/BlockLength, Style/NumericLiterals
RSpec.describe "map/_map_sidebar.html.erb" do
  required_fields = {
    qct: %w[tract_fips county state],
    qct_e: %w[tract_fips county state],
    qct_r: %w[tract_fips county state],
    qnmc: %w[county_fips county state],
    qnmc_a: %w[county_fips county state],
    qnmc_b: %w[county_fips county state],
    qnmc_c: %w[county_fips county state],
    qnmc_ab: %w[county_fips county state],
    qnmc_r: %w[county_fips county state],
    indian_lands: %w[name census type class gnis],
    brac: %w[brac_sba_name fac_type effective],
    qct_brac: %w[brac_sba_name fac_type effective tract_fips county state],
    qnmc_brac: %w[brac_sba_name fac_type effective county_fips county state],
    qct_qda: %w[incident_description qda_declaration qda_designation qda_publish tract_fips county state],
    qnmc_qda: %w[incident_description qda_declaration qda_designation qda_publish county_fips county state]
  }
  responses = {
    qct: {
      "gid" => 33232,
      "tract_fips" => "24510040100",
      "county" => "Dalmok",
      "state" => "MD",
      "omb_delineation" => "Metropolitan",
      "prior_status" => "Qualified",
      "current_status" => "Qualified",
      "status_change" => false,
      "redesignated" => false,
      "expires" => nil,
      "effective" => "2017-01-01",
      "hz_type" => "qct_e"
    },
    qct_r: {
      "gid" => 3077,
      "tract_fips" => "24510030200",
      "county" => "Jelhad",
      "state" => "MD",
      "omb_delineation" => "Metropolitan",
      "prior_status" => "Redesignated until Jan 2018",
      "current_status" => "Redesignated until Jan 2018",
      "status_change" => false,
      "redesignated" => true,
      "expires" => "2018-01-31",
      "effective" => "2017-01-01",
      "hz_type" => "qct_r"
    },
    qnmc: {
      "gid" => 1821,
      "county_fips" => "35047",
      "county" => "Tanagra",
      "state" => "NM",
      "march_2017_status_current" => "Qualified by Income and Unemployment",
      "median_household_income_ratio_2016" => 0.732224698840442,
      "state_unemployment_ratio_2015" => 116.667,
      "us_unemployment_ratio_2015" => 145.283,
      "omb_delineation" => "Non-metropolitan",
      "q_inc_2017" => 1,
      "initial_analysis" => "Qualified",
      "q_dda_2017" => 0,
      "july_2016_status_previous" => "Qualified by Income and Unemployment",
      "income" => true,
      "unemployment" => true,
      "dda" => false,
      "redesignated" => false,
      "expires" => nil,
      "effective" => "2017-03-01",
      "qda" => false,
      "hz_type" => "qnmc_ab"
    },
    qnmc_r: {
      "gid" => 1821,
      "county_fips" => "35047",
      "county" => "Madison County",
      "state" => "NM",
      "march_2017_status_current" => "Redesignated until April 2020",
      "median_household_income_ratio_2016" => 0.732224698840442,
      "state_unemployment_ratio_2015" => 116.667,
      "us_unemployment_ratio_2015" => 145.283,
      "omb_delineation" => "Non-metropolitan",
      "q_inc_2017" => 1,
      "initial_analysis" => "Qualified",
      "q_dda_2017" => 0,
      "july_2016_status_previous" => "Qualified by Income and Unemployment",
      "income" => true,
      "unemployment" => true,
      "dda" => false,
      "redesignated" => true,
      "expires" => "2020-04-01",
      "effective" => "2017-03-01",
      "qda" => false,
      "hz_type" => "qnmc_r"
    },
    brac: {
      "brac_id" => "84",
      "brac_sba_name" => "Ft Awesome",
      "fac_type" => "Army Installation",
      "effective" => "2011-09-09",
      "tract_fips" => "51740213001",
      "county" => "Portsmouth city",
      "state" => "VA",
      "expires" => "2020-12-31",
      "hz_type" => "qct_brac"
    },
    qct_qda: {
      "county" => "Tanagra",
      "county_fips" => "23783",
      "expires" => "2020-12-30",
      "hz_type" => "qct_qda",
      "incident_description" => "The walls fell",
      "qda_declaration" => "2016-10-10",
      "qda_designation" => "2016-10-10",
      "qda_id" => "200",
      "qda_publish" => "2017-03-02",
      "state" => "AA"
    },
    qnmc_qda: {
      "county" => "Madison County",
      "county_fips" => "23783",
      "expires" => "2020-12-30",
      "hz_type" => "qnmc_qda",
      "incident_description" => "The bridges",
      "qda_declaration" => "2016-10-10",
      "qda_designation" => "2016-10-10",
      "qda_id" => "200",
      "qda_publish" => "2017-03-02",
      "state" => "AA"
    },
    indian_lands: {
      "gid" => 388,
      "objectid" => 388,
      "id" => "1465548.00000",
      "indian" => "5684200",
      "state" => "56",
      "census" => "564610R",
      "gnis" => 1597068,
      "name" => "Wind River WY",
      "type" => "Reservation",
      "class" => "American Indian Area (Reservation Only)",
      "recognitio" => "Federal",
      "land_area" => "3466.93000000",
      "water_area" => "57.7900000000",
      "shape_leng" => "4.82280634846",
      "shape_area" => "1.01232528632",
      "effective" => "2014-01-01",
      "expires" => nil,
      "hz_type" => "indian_lands"
    }
  }
  body = {
    "address_components" => [
      {
        "long_name" => "8",
        "short_name" => "8",
        "types" => ["street_number"]
      },
      {
        "long_name" => "Market Place",
        "short_name" => "Market Pl",
        "types" => ["route"]
      },
      {
        "long_name" => "Baltimore",
        "short_name" => "Baltimore",
        "types" => %w[locality political]
      },
      {
        "long_name" => "United States",
        "short_name" => "US",
        "types" => %w[country political]
      }
    ],
    "formatted_address" => "8 Market Pl, Baltimore, MD 21202, USA",
    "geometry" => {
      "location" => {
        "lat" => 39.2888915,
        "lng" => -76.6069962
      }
    },
    "hubzone" => []
  }
  %w[en dev].each do |locale|
    context "testing for the #{locale} locale" do
      responses.each_key do |type|
        context "displays the sidebar for #{type}" do
          before do
            body["hubzone"] = [responses[type]]
            I18n.locale = locale
            render partial: "map/map_sidebar", locals: {body: body, locale: locale}
          end

          if responses[type].empty?
            it "should show no qualification" do
              expect(rendered).to have_css("th.non-qualified-hubzone")
            end
          else
            it "should show qualified" do
              expect(rendered).to have_css("th.qualified-hubzone")
            end
          end
          context "should have the correct data for #{type}" do
            it "should have the right layer symbology for #{type}" do
              expect(rendered).to have_css(".layer-" + responses[type]["hz_type"])
            end
            req_details = required_fields[type]
            req_details.each do |detail|
              if detail.in? %w[effective qda_designation qda_publish qda_declaration]
                it "should display the correct effective date format for #{detail}" do
                  date = Date.parse responses[type][detail.to_s]
                  expect(rendered).to have_content(I18n.l(date, format: :full))
                end
              else
                it "should contain the correct data for #{detail}" do
                  expect(rendered).to have_content(responses[type][detail.to_s]) unless detail.eql? "effective"
                end
              end
            end
          end
        end
      end
      context "multiple disignations" do
        before do
          body["hubzone"] = [responses[:qct], responses[:qnmc_r], responses[:brac], responses[:indian_lands], responses[:qnmc_qda]]
          I18n.locale = locale
          render partial: "map/map_sidebar", locals: {body: body, locale: locale}
        end
        it "should show qualified" do
          expect(rendered).to have_css("th.qualified-hubzone")
        end
        types = %i[qct qnmc_r brac indian_lands qnmc_qda]
        types.each do |type|
          it "should have the right layer symbology for #{type}" do
            expect(rendered).to have_css(".layer-" + responses[type]["hz_type"])
          end
          req_details = required_fields[type]
          req_details.each do |detail|
            if detail.in? %w[effective qda_designation qda_publish qda_declaration]
              it "should display the correct effective date format for #{detail}" do
                date = Date.parse responses[type][detail.to_s]
                expect(rendered).to have_content(I18n.l(date, format: :full))
              end
            else
              it "should contain the correct data for #{detail}" do
                expect(rendered).to have_content(responses[type][detail.to_s]) unless detail.eql? "effective"
              end
            end
          end
        end
      end
    end
  end
end
