require 'rubygems'
require 'bundler'
require 'pry'
require 'csv'
Bundler.setup

# Add reusable tasks to this file:
import 'shared/Rakefile'

require 's3deploy/tasks'

S3deploy.configure do
  bucket 'apps.voxmedia.com'
  app_path 'vox-election-results-2016'
  dist_dir 'processed_data/election_results'
  gzip [/\.js$/, /\.css$/, /\.json$/, /\.html$/, /\.csv$/,
        /\.eot$/, /\.svg$/, /\.ttf$/, /\.woff$/, /\.woff2$/]

  access_key_id ENV['AWS_ACCESS_KEY_ID']
  secret_access_key ENV['AWS_SECRET_ACCESS_KEY']
end

# Add project specifc tasks or overrides below

def excel_to_hash(excel_file, sheet_name = nil)
  excel = read_excel(excel_file)
  excel = excel.sheet(sheet_name) unless sheet_name.nil?
  keys = excel.row(1)
  output = excel.map {|k| Hash[keys.zip(k.to_a)]}
  output.shift # drop header row
  output
end

def excel_to_csv(excel_file, csv_file = nil)
  excel = read_excel(excel_file)

  file_content = ''
  total_records = excel.last_row

  # Iterating through each row because there is no enumerable object.
  # Row indexing starts from 1. Not 0
  excel.each do |row|
    print "\rparsing #{row_num} of #{total_records}..."
    file_content += row.to_a.to_csv
  end
  puts '' # Moving cursor to next line
  return CSV.parse(file_content, :headers => true) if csv_file.nil?

  puts "Writing to CSV file #{csv_file}"
  File.open(csv_file, 'w') do |file|
    file.write file_content
  end
end

def excel_to_arr_hash(excel_file)
  csv_rows = excel_to_csv(excel_file)
  csv_to_hash csv_rows
end

def read_excel(excel_file)
  puts 'reading excel file...'
  require 'roo'
  Roo::Excelx.new(excel_file)
end

def state_fips
  csv = CSV.read('./original_data/fips.csv', :headers => true)
  st_fips = {}
  csv.each {|v| st_fips[v['state']] = v['stfips']}
  st_fips
end

def fips_state
  csv = CSV.read('./original_data/fips.csv', :headers => true)
  fips_st = {}
  csv.each do |v|
    key = v['stfips'].rjust(2,"0")
    fips_st[key] = v['state']
  end
  fips_st
end

def county_fips
  csv = CSV.read('./original_data/fips.csv', :headers => true)
  ct_fips = {}
  words = [' County', ' Area', ' Municipality', ' Borough', ' Parish']
  replace_regex = Regexp.union(words)
  csv.each do |v|
    name = v['name']
    name = 'Carson' if v['name'] == 'Carson City' && v['state'] == 'NV'
    key = "#{name.gsub(replace_regex, '')}, #{v['state']}"
    ct_fips[key] = "#{v['stfips']}#{v['ctyfips'].rjust(3,'0')}"
  end
  ct_fips
end

def states
  state_fips.keys
end

# Rake tasks
desc 'import 2017 coverage data'
task :import_2017_coverage do
  cont = yes?('This will delete all existing records for 2017. Continue?')
  exit unless cont
  excel_file =  './original_data/RWJF/carriersbycounty2017.xlsx'
  insurance_hash = excel_to_hash excel_file

  bucket = kinto_bucket(datastore_config['bucket'])
  coverage_2017 = bucket.collection('coverage-2017')

  puts 'Deleting existing records...'
  # need a while loop because only a 1000 records get deleted at a time
  coverage_2017.delete_records while !coverage_2017.count_records.zero?

  uploaded = 0
  failed = 0
  # remove all providers not on market
  insurance_hash.select! {|h| h['market'] == 'on_market'}
  insurance_hash.each_slice(100) do |row_group|
    batch_req = kinto_client.create_batch_request
    row_group.each do |row|
      row['fips_code'] = row['fips_code'].to_s.rjust(5, '0')
      # Avoiding data mismatch from AK's changed county name
      # See https://www.census.gov/geo/reference/county-changes.html
      if row['fips_code'] == '02270'
        row['fips_code'] = '02158'
        row['county_name'] = 'Kusilvak'
      end
      row['provider_name'] = row.delete 'carrier'
      row['provider_id'] = row.delete 'issuer_id'
      row['is_active'] = true
      row.delete 'plan_count'
      batch_req.add_request(coverage_2017.create_record_request row)
    end
    resp = batch_req.send
    failures = resp['responses'].select {|x| x["status"] != 201}
    failed += failures.count
    uploaded += row_group.count
    print "\rUploaded #{uploaded} of #{insurance_hash.count} records. #{failures.count} failures"
  end
  puts ''
  puts "\rUploaded #{uploaded} records with #{failed} failures"
end

desc 'Shard presidential election results'
task :shard_election_results do
  puts 'Reading CSV...'
  results = CSV.read('./original_data/us_atlas/2016_results.csv',
                      :headers => true)
                .drop(1)
                .map {|r| {'fips' => r['FIPS'],
                            'total_vote' => r['Total Vote'],
                            'clinton' => r['Hillary Clinton'],
                            'trump' => r['Donald J. Trump']
                          }
                      }

  require 'fileutils'
  File.open('./processed_data/election_results/US_results.json', 'w') do |file|
    file.write results.to_json
  end
  FileUtils::mkdir_p './processed_data/election_results'
  results.chunk {|x| x['fips'][0, x['fips'].length-3].rjust(2,"0")}
         .map  do |f, rows|
           File.open("./processed_data/election_results/#{fips_state[f]}_results.json", 'w') do |file|
             print "\rWriting #{fips_state[f]} file..."
             file.write rows.to_json
           end
         end
  print "\n"
  puts 'Uploading to S3...'
  Rake::Task['s3:deploy'].invoke
  puts "Done!"
end

desc 'Import coverage history'
task :import_coverage_history do
  cont = yes?('This will delete all existing records for 2017. Continue?')
  exit unless cont
  [*2014..2016].each do |year|
    puts "uploading data for #{year}..."
    excel_file =  "./original_data/coverage_history/#{year}.xlsx"
    coverage_hash = excel_to_hash(excel_file, 'issuers')

    bucket = kinto_bucket(datastore_config['bucket'])
    collection = bucket.collection("coverage-#{year}")

    puts 'Deleting existing records...'
    # need a while loop because only a 1000 records get deleted at a time
    collection.delete_records while !collection.count_records.zero?

    uploaded = 0
    failed = 0
    fips_hash = county_fips
    coverage_hash.each_slice(100) do |row_group|
      batch_req = kinto_client.create_batch_request
      row_group.each do |row|
        row['provider_name'] = row.delete 'i'
        row['state'] = row.delete 's'
        row['county_name'] = row.delete 'c'
        row['fips_code'] = fips_hash[row['id']]
        puts row['id'] if row['fips_code'].nil?
        row.delete 'id'
        batch_req.add_request(collection.create_record_request row)
      end
      resp = batch_req.send
      failures = resp['responses'].select {|x| x["status"] != 201}
      failed += failures.count
      uploaded += row_group.count
      print "\rUploaded #{uploaded} of #{coverage_hash.count} records. #{failures.count} failures"
    end
    puts ''
    puts "\rUploaded #{uploaded} records with #{failed} failures"
  end
end

desc 'Add population data as JSON'
task :add_pop_data do
  puts 'Reading CSV...'
  pop_hash = CSV.read('./original_data/HHS/planSelections.csv',
                      :headers => true)
                .map {|r| [r['FIPS'].to_s.rjust(5, '0'),
                            {'county' => r['County'],
                            'state' => r['State'],
                            'subscribers' => r['Plan_Selections'].to_i
                          }]
                      }.to_h
  # Avoiding data mismatch from AK's changed county name
  # See https://www.census.gov/geo/reference/county-changes.html
  pop_hash['02158'] = pop_hash.delete '02270' unless pop_hash['02270'].nil?
  pop_hash['02158']['county'] = 'Kusilvak' unless pop_hash['02158'].nil?

  puts 'Writing as JSON hash...'
  require 'fileutils'
  File.open('./data/subscribers.json', 'w') do |file|
    file.write pop_hash.to_json
  end
  puts 'Done!'
end

desc 'County lookup data'
task :add_county_lookup do
  puts 'Reading file...'
  csv = CSV.read('./original_data/fips.csv', :headers => true)
  result = {}
  csv.each do |row|
    key = row['state']
    result[key] = [] if result[key].nil?
    curr_obj = { 'county_name' => row['name'],
                 'fips_code' => "#{row['stfips']}#{row['ctyfips'].rjust(3,'0')}"}

   if curr_obj['fips_code'] == '02270'
     curr_obj['fips_code'] = '02158'
     curr_obj['county_name'] = 'Kusilvak County'
   end

    result[key].push(curr_obj)
  end
  puts 'Writing as JSON hash...'
  require 'fileutils'
  File.open('./data/counties_by_state.json', 'w') do |file|
    file.write result.to_json
  end
  puts 'Done!'
end

desc 'Backup data'
task :backup_data do
  bucket = kinto_bucket(datastore_config['bucket'])
  coverage_2017 = bucket.collection('coverage-2017')
  require 'fileutils'
  get_filename = true
  now = DateTime.now.strftime('%Y_%m_%d_%H%M')
  i = 1
  while get_filename do
    file_path = "./backup_data/coverage_2017_#{now}.json"
    if File.exist?(file_path)
      cont = yes?("Replace file #{file_path}?")
      if cont
        File.delete(file_path)
        get_filename = false
      else
        now = "#{now}_#{i}"
        i = i + 1
      end
    else
      get_filename = false
    end
  end

  states.each do |s|
    puts s
    resp = coverage_2017.list_records("state=#{s}")
    puts resp['data'].count

    File.open(file_path, 'a+') do |file|
      file.write resp['data'].to_json
    end
  end
end
