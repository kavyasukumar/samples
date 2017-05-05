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

def excel_to_hash(excel_file)
  excel = read_excel(excel_file)
  keys = excel.row(1)
  output = excel.map ***REMOVED***|k| Hash[keys.zip(k.to_a)]***REMOVED***
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
    print "\rparsing #***REMOVED***row_num***REMOVED*** of #***REMOVED***total_records***REMOVED***..."
    file_content += row.to_a.to_csv
  end
  puts '' # Moving cursor to next line
  return CSV.parse(file_content, :headers => true) if csv_file.nil?

  puts "Writing to CSV file #***REMOVED***csv_file***REMOVED***"
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
  st_fips = ***REMOVED******REMOVED***
  csv.each ***REMOVED***|v| st_fips[v['state']] = v['stfips']***REMOVED***
  st_fips
end

def fips_state
  csv = CSV.read('./original_data/fips.csv', :headers => true)
  st_fips = ***REMOVED******REMOVED***
  csv.each do |v|
    key = v['stfips'].rjust(2,"0")
    st_fips[key] = v['state']
  end
  st_fips
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
  insurance_hash.each_slice(100) do |row_group|
    batch_req = kinto_client.create_batch_request
    row_group.each do |row|
      row['provider_name'] = row.delete 'carrier'
      row['provider_id'] = row.delete 'issuer_id'
      row['is_active'] = true
      batch_req.add_request(coverage_2017.create_record_request row)
    end
    resp = batch_req.send
    failures = resp['responses'].select ***REMOVED***|x| x["status"] != 201***REMOVED***
    failed += failures.count
    uploaded += row_group.count
    print "\rUploaded #***REMOVED***uploaded***REMOVED*** of #***REMOVED***insurance_hash.count***REMOVED*** records. #***REMOVED***failures.count***REMOVED*** failures"
  end
  puts ''
  puts "\rUploaded #***REMOVED***uploaded***REMOVED*** records with #***REMOVED***failed***REMOVED*** failures"
end

desc 'Shard presidential election results'
task :shard_election_results do
  puts 'Reading CSV...'
  results = CSV.read('./original_data/us_atlas/2016_results.csv',
                      :headers => true)
                .drop(1)
                .map ***REMOVED***|r| ***REMOVED***'fips' => r['FIPS'],
                            'total_vote' => r['Total Vote'],
                            'clinton' => r['Hillary Clinton'],
                            'trump' => r['Donald J. Trump']
                          ***REMOVED***
                      ***REMOVED***

  require 'fileutils'
  FileUtils::mkdir_p './processed_data/election_results'
  results.chunk ***REMOVED***|x| x['fips'][0, x['fips'].length-3].rjust(2,"0")***REMOVED***
         .map  do |f, rows|
           File.open("./processed_data/election_results/#***REMOVED***fips_state[f]***REMOVED***_results.json", 'w') do |file|
             print "\rWriting #***REMOVED***fips_state[f]***REMOVED*** file..."
             file.write rows.to_json
           end
         end
  print "\n"
  puts 'Uploading to S3...'
  Rake::Task['s3:deploy'].invoke
  puts "Done!"
end

desc 'Import provider colection'
task :import_providers do
  excel_file =  './original_data/RWJF/carriersbycounty2017.xlsx'
  insurance_hash = excel_to_hash excel_file

 providers = insurance_hash.collect ***REMOVED*** |x| ***REMOVED*** 'provider_id' => x['issuer_id'],
                                            'provider_name' => x['carrier'],
                                            'group_name' => x['carrier'],
                                            'group_id' => x['issuer_id'],
                                            'state' => x['state']
                                          ***REMOVED***
                                    ***REMOVED***.uniq
  bucket = kinto_bucket(datastore_config['bucket'])
  collection = bucket.collection('provider-groups')

  puts 'Deleting existing records...'
  # need a while loop because only a 1000 records get deleted at a time
  collection.delete_records while !collection.count_records.zero?

  uploaded = 0
  providers.each_slice(100) do |row_group|
    batch_req = kinto_client.create_batch_request
    row_group.each do |row|
      batch_req.add_request(collection.create_record_request row)
    end
    batch_req.send
    uploaded += row_group.count
    print "\rUploaded #***REMOVED***uploaded***REMOVED*** of #***REMOVED***providers.count***REMOVED*** records"
  end
  print "\n"
end
