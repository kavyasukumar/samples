import csv

simplified_2017 = ***REMOVED******REMOVED***
simple_array_2017 = []

simplified_ins_2017 = ***REMOVED******REMOVED***

with open('../source/temp_data/plan_county_report_2017.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        if len(row['fips_code']) < 5:
            row['fips_code'] = '0'+row['fips_code']
        simplified_2017.setdefault(row['fips_code'], []).append(row['plan_count'])
        simplified_ins_2017.setdefault(row['fips_code'], []).append(1)

with open('../source/temp_data/simple_plan_count_2017.csv', 'w') as csvfile:
    fieldnames = ['fips_code', 'count']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for item in simplified_2017:
        count = 0
        for x in simplified_2017[item]:
            count += int(x)
        writer.writerow(***REMOVED***'fips_code': item, 'count': count***REMOVED***)

with open('../source/temp_data/simple_2017.csv', 'w') as csvfile:
    fieldnames = ['fips_code', 'count']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for item in simplified_ins_2017:
        count = 0
        for x in simplified_ins_2017[item]:
            count += x
        writer.writerow(***REMOVED***'fips_code': item, 'count': count***REMOVED***)
