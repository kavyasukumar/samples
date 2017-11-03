import csv, json

zooms = {}

with open('../../original_data/zoom_levels.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        zooms.setdefault(row['state'], float(row['zoom']))

    print json.dumps(zooms)
