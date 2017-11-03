import csv, json

fips = {}

with open('../../original_data/fips.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        fips.setdefault(row['state'], []).append(row['stfips']+row['ctyfips'])

with open('../../original_data/fips.json', 'w') as outfile:
    json.dump(fips, outfile)
# print fips
#
# states = []
# for key, value in fips.iteritems():
#     states.append(key)
#
# print sorted(states)
