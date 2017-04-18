require 'rubygems'
require 'bundler'
require 'pry'
Bundler.setup

# Add reusable tasks to this file:
import 'shared/Rakefile'

# Add project specifc tasks or overrides below

def excel_to_csv(excel_file, csv_file = nil)
  excel = read_excel(excel_file)

  # Row indexing starts from 1
  # Iterating through each row  because there is no enumerable object.
  file_content = ''
  total_records = excel.last_row
  [*1..total_records].each do |row_num|
    print "\rparsing #***REMOVED***row_num***REMOVED*** of #***REMOVED***total_records***REMOVED***..."
    file_content += excel.row(row_num).to_csv
  end
  puts ""
  return CSV.parse(file_content) if csv_file.nil?

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

def csv_to_hash(csv_obj)
  require 'active_support/inflector'
  keys = csv_obj.shift.map ***REMOVED***|k| k.parameterize ***REMOVED***
  csv_obj.map ***REMOVED***|x| Hash[ keys.zip(x) ] ***REMOVED***
end


desc 'Update 2017 coverage data'
task :update_2017_coverage do
  cont = yes?('This will delete all existing records for 2017. Continue?')
  exit unless cont
  excel_file =  './original-data/RWJF/carriersbycounty2017.xlsx'
  insurance_hash = excel_to_arr_hash excel_file

  bucket = kinto_bucket(datastore_config['bucket'])
  coverage_2017 = bucket.collection('coverage-2017')

  puts 'Deleting existing records...'
  # need a while loop because only a 1000 records get deleted at a time
  coverage_2017.delete_records while !coverage_2017.count_records.zero?

  uploaded = 0
  insurance_hash.each_slice(100) do |row_group|
    batch_req = kinto_client.create_batch_request
    row_group.each do |row|
      batch_req.add_request(coverage_2017.create_record_request row)
    end
    batch_req.send
    uploaded += row_group.count
    print "\rUploaded #***REMOVED***uploaded***REMOVED*** of #***REMOVED***insurance_hash.count***REMOVED*** records"
  end
end
