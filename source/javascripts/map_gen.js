/* globals DataAdapter, Alpaca */
//= require _data_adapter
//= require _vendor_extra/moment
//= require _vendor/pancake.stack
//= require _vendor/textures.min
(function() ***REMOVED***
  // Application code goes here
  var stateIdx = ['WA', 'MT', 'ID', 'ND', 'MN', 'ME', 'MI', 'WI', 'OR', 'SD', 'NH', 'VT', 'NY', 'WY', 'IA', 'NE', 'MA', 'IL', 'PA', 'CT', 'RI', 'CA', 'UT', 'NV', 'OH', 'IN', 'NJ', 'CO', 'WV', 'MO', 'KS', 'DE', 'MD', 'VA', 'KY', 'DC', 'AZ', 'OK', 'NM', 'TN', 'NC', 'TX', 'AR', 'SC', 'AL', 'GA', 'MS', 'LA', 'FL', 'HI', 'AK'];
  var zoomLevels = ***REMOVED***"WA": 0.75, "DE": 0.6, "WI": 0.55, "WV": 0.6, "HI": 0.7, "FL": 0.6, "WY": 0.55, "NH": 0.55, "NJ": 0.6, "NM": 0.55, "TX": 0.6, "LA": 0.6, "NC": 0.85, "ND": 0.75, "NE": 0.8, "TN": 0.9, "NY": 0.65, "PA": 0.7, "CA": 0.6, "NV": 0.6, "CO": 0.6, "AL": 0.6, "AR": 0.6, "VT": 0.55, "IL": 0.6, "GA": 0.6, "IN": 0.55, "IA": 0.7, "OK": 0.8, "AZ": 0.55, "ID": 0.55, "CT": 0.6, "ME": 0.55, "MD": 0.7, "MA": 0.7, "OH": 0.55, "UT": 0.55, "MO": 0.55, "MN": 0.55, "MI": 0.55, "RI": 0.6, "KS": 0.7, "MT": 0.75, "MS": 0.55, "SC": 0.65, "KY": 0.9, "OR": 0.65, "SD": 0.7, "AK": 0.9, "DC": 12.0***REMOVED***;

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      formData = ***REMOVED***
        'map_type': "U.S.",
        'map_num': "single",
        'select_year': "2017",
        'election_results': false
      ***REMOVED***,
      oldFormData = ***REMOVED******REMOVED***,
      currentYear,
      active = d3.select(null),
      tester;

  // var projection = d3.geoAlbersUsa()
  //     .scale(1000)
  //     .translate([width / 2, height / 2]);
  var projection = null;

  var zoom = d3.zoom()
      .on("zoom", zoomed);

  var initialTransform = d3.zoomIdentity
      .translate(0,0)
      .scale(1);

  var path = d3.geoPath()
      .projection(projection);

  svg.on("click", stopped, true);

  // var myColors = ['#fff200', '#ddd', '#bed8e9', '#8cafcd', '#5a87b2', '#5a87b2', '#5a87b2', '#5a87b2', '#285f96', '#285f96', '#00377b', '#00377b', '#00377b', '#00377b', '#00377b'];
  var myColors = ['#fff200', '#ddd', '#bed8e9', '#8cafcd', '#5a87b2', '#5a87b2', '#285f96', '#285f96', '#00377b', '#00377b'];

  var color = d3.scaleOrdinal()
      .domain(d3.range(0, 9))
      .range(myColors);


  function drawScale()***REMOVED***
    var g = svg.append("g").attr('class', 'scale')
               .attr('transform', "translate(5,685)");

    g.selectAll("rect")
      .data(color.range().map(function(d) ***REMOVED*** return d; ***REMOVED***))
      .enter().append("rect")
        .attr("height", 20)
        .attr("x", function(d, i) ***REMOVED*** return i*59; ***REMOVED***)
        .attr("width", 59)
        .attr("fill", function(d) ***REMOVED*** return d; ***REMOVED***);

    g.append("text")
        .attr("class", "caption")
        .attr("y", -10)
        .attr("fill", "#777777")
        .attr("text-anchor", "start")
        .attr('font-size', '22px')
        .attr('font-family', 'Nitti')
        .text("Number of ACA insurers available");

      g.selectAll("text")
        .data([0, 0, 1, 2, 3, 4, 6, 8, 10])
        .enter().append("text")
        .attr("x", function(d, i) ***REMOVED*** return d*59; ***REMOVED***)
        .attr("y", 45)
        .attr("fill", "#777777")
        .attr('class', 'value')
        .attr("text-anchor", "middle")
        .attr('font-size', '20px')
        .attr('font-family', 'Nitti')
        .text(function(d) ***REMOVED*** return d; ***REMOVED***);

      g.selectAll("line")
        .data([0, 1, 2, 3, 4, 6, 8, 10])
        .enter().append("line")
        .attr("x1", function(d, i) ***REMOVED*** return d*59; ***REMOVED***)
        .attr("x2", function(d, i) ***REMOVED*** return d*59; ***REMOVED***)
        .attr("y1", 0)
        .attr("y2", 28)
        .attr('value', function(d)***REMOVED***
          return d;
        ***REMOVED***)
        .attr('stroke', '#999')
        .attr('width', "1px");

  ***REMOVED***

  function clicked() ***REMOVED***

    var bounds = path.bounds(tester),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        zoomLevel = zoomLevels[formData['state_select']] || 0.6,
        scale = Math.max(1, Math.min(15, zoomLevel / Math.max(dx / width, dy / height)));
        if(formData['state_select'] === 'DC')***REMOVED***
          scale = 100;
        ***REMOVED***

    var translate = [width / 2 - scale * x, height / 2 - scale * y];

    var transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);

    d3.selectAll('.counties').transition()
        .duration(750)
        .call(zoom.transform, transform);
  ***REMOVED***

  function reset() ***REMOVED***
    active.classed("active", false);
    active = d3.select(null);

    svg.transition()
        .duration(750)
        .call(zoom.transform, initialTransform);
  ***REMOVED***

  function zoomed() ***REMOVED***
    var transform = d3.event.transform;

    d3.selectAll('.counties').style("stroke-width", 1.5 / transform.k + "px");
    d3.selectAll('.counties').attr("transform", transform);
  ***REMOVED***

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() ***REMOVED***
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  ***REMOVED***

  function drawMap(data)***REMOVED***
    d3.select('#loading-animation').style('display', 'none');
    console.log('draw map!');
    if(formData === oldFormData)***REMOVED***
      return;
    ***REMOVED*** else ***REMOVED***
      oldFormData = formData;
      if(formData['map_type'] === 'state' && formData['state_select'] !== 'AK')***REMOVED***
        projection = d3.geoMercator()
                        .center([43.09, -79.06])
                        .scale(800)
                        .translate([width / 2, height / 2]);
      ***REMOVED*** else ***REMOVED***
        // projection = d3.geoAlbersUsa()
        //                 .scale(1000)
        //                 .translate([width / 2, height / 2]);
        projection = null;
      ***REMOVED***
      path.projection(projection);

      console.log(formData);
      svg.html('');
      if(formData['image_title'])***REMOVED***
        var titleG = svg.append('g')
                         .attr('font-family', 'Balto')
                         .attr('transform', 'translate(5,25)')

        if(formData['image_title'].length > 50)***REMOVED***
          var titleArray = [],
              wordArray = formData['image_title'].split(' '),
              x = Math.ceil(formData['image_title'].length/50),
              count = 0,
              temp = [];

          for(i in wordArray)***REMOVED***
            if(count + wordArray[i].length+1 < 50)***REMOVED***
              temp.push(wordArray[i]);
              count += wordArray[i].length;
            ***REMOVED*** else ***REMOVED***
              titleArray.push(temp);
              temp = [wordArray[i]];
              count = wordArray[i].length + 1;
            ***REMOVED***
          ***REMOVED***
          titleArray.push(temp);

          for(i in titleArray)***REMOVED***
            var num = parseInt(i);
            titleG.append("text")
                  .attr('class', 'title')
                  .attr('y', num*34)
                  .attr("font-weight", "bold")
                  .attr('font-size', '32px')
                  .attr('fill', '#474747')
                  .text(titleArray[i].join(' '));
          ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          titleG.append("text")
                .attr('class', 'title')
                .attr('y', 25)
                .attr("font-weight", "bold")
                .attr('font-size', '32px')
                .attr('fill', '#474747')
                .text(formData['image_title']);
        ***REMOVED***

      ***REMOVED***
      svg.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height)
          .attr("fill", 'none');

      drawScale();

      if(formData['map_type'] === 'state' && formData['state_select'] !== 'AK')***REMOVED***
        d3.queue()
            .defer(d3.json, "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json")
            .await(ready);
      ***REMOVED*** else ***REMOVED***
        d3.queue()
            .defer(d3.json, "https://d3js.org/us-10m.v1.json")
            .await(ready);
      ***REMOVED***


      var largest = 0;

      function ready(error, us) ***REMOVED***
        console.log('ready');
        var tj = topojson.feature(us, us.objects.counties).features;
        if (error) throw error;

        var stf = [];
        stf = state_fips[formData['state_select']];
         svg.append("g").attr("class", "counties paths")
            .attr('transform', 'translate(30,90) scale(.85)')
            .selectAll("path")
            .data(tj)
          .enter().append("path")
            .attr("fill", function(d) ***REMOVED***
              var tFill;
              var shortFips = d.id;
              if(String(d.id).length === 4)***REMOVED***
                d.id = '0'+String(d.id);
              ***REMOVED***
              if(formData['map_type'] === 'state')***REMOVED***
                if(_.contains(stf, String(d.id)))***REMOVED***
                  if(data[d.id] > largest)***REMOVED***
                    largest = data[d.id];
                  ***REMOVED***
                  if(data[d.id])***REMOVED***
                    tFill = myColors[data[d.id]];
                  ***REMOVED*** else ***REMOVED***
                    tFill = '#fff200';
                  ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                  tFill = 'none';
                ***REMOVED***
              ***REMOVED*** else ***REMOVED***
                if(d.id === '46102')***REMOVED***
                  d.id = '46113';
                ***REMOVED***
                if(data[d.id] > largest)***REMOVED***
                  largest = data[d.id];
                ***REMOVED***
                if(data[d.id])***REMOVED***
                  tFill = myColors[data[d.id]];
                ***REMOVED*** else ***REMOVED***
                  tFill = '#fff200';
                ***REMOVED***
              ***REMOVED***
              return tFill;

            ***REMOVED***)
            .attr('id', function(d)***REMOVED***
              return 'f_'+d.id+' '+data[d.id];
            ***REMOVED***)
            .attr("d", path)
            .attr("stroke", function(d)***REMOVED***
              if(formData['map_type'] === 'state')***REMOVED***
                if(_.contains(stf, String(d.id)))***REMOVED*** return '#fff'; ***REMOVED***
              ***REMOVED*** else ***REMOVED***
                if(data[d.id])***REMOVED*** return '#fff'; ***REMOVED***
              ***REMOVED***
            ***REMOVED***)
            .attr('stroke-width', '0.5px')
          .append("title")
            .text(function(d) ***REMOVED*** return d.count; ***REMOVED***);

          svg.append("path")
              .attr('transform', 'translate(30,90) scale(.85)')
              .datum(topojson.mesh(us, us.objects.states, function(a, b) ***REMOVED*** return a !== b; ***REMOVED***))
              .attr("class", "mesh")
              .attr("d", path)
              .attr('fill', 'none')
              .attr('stroke', '#fff')

          if(formData['map_type'] === 'state')***REMOVED***
            d3.selectAll('.mesh').style('display', 'none');
          ***REMOVED*** else ***REMOVED***
            d3.selectAll('.mesh').style('display', 'block');
          ***REMOVED***
          if(formData['map_type'] === 'state')***REMOVED***
            if(formData['state_select'] === 'AK')***REMOVED***
              tester = topojson.feature(us, us.objects.states).features[26];
            ***REMOVED*** else ***REMOVED***
              tester = topojson.feature(us, us.objects.states).features[_.indexOf(stateIdx, formData['state_select'])];
            ***REMOVED***
            d3.selectAll('.counties').attr('stroke', 'none').attr('fill', 'none');
            clicked();
          ***REMOVED*** else ***REMOVED***
            d3.selectAll('.counties').attr('stroke', '#ccc').attr('fill', '#ccc');
          ***REMOVED***
          $('.scale rect').each(function(i)***REMOVED***
            if(i > largest)***REMOVED***
              $(this).hide();
            ***REMOVED***
          ***REMOVED***);
          $('.scale .value').each(function()***REMOVED***
            if(parseInt($(this).html()) > largest+1)***REMOVED***
              $(this).hide();
            ***REMOVED***
          ***REMOVED***);
          $('.scale line').each(function(i)***REMOVED***
            if(parseInt($(this).attr('value')) > largest+1)***REMOVED***
              $(this).hide();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***

        svg.append('g')
            .attr('class', 'vox-logo')
            .attr('transform', 'translate(798,750)')
            .attr('preserveAspectRatio', "none")
            .append('path')
            .attr('fill', '#474747')
            .attr('d', "M42.47,1.28h1.31l0.15-.62H27.45l-0.15.62h2.39c2.08,0,3.78,1.46,3.78,4.32a16.55,16.55,0,0,1-1.85,6.24L20.9,35.5,18.28,4.75C18,2.36,19.28,1.28,22,1.28h1.54l0.15-.62H0.4l-0.23.62H1.63c1.85,0,2.54,1.16,2.7,3.31L8.49,44.36h9.79L34.69,9.61C37.23,4.44,39.85,1.28,42.47,1.28ZM40.55,44.52c-1.46,0-2.39-.46-2.39-2.93,0-3.08,1.16-9.17,2.39-14.72C40.7,29.41,42.47,32,45.09,32a11.54,11.54,0,0,0,1.7-.15C44.32,42.36,43.4,44.52,40.55,44.52Zm46.7-20.88a5.17,5.17,0,0,0,5.09-5.47A4.17,4.17,0,0,0,88,13.84c-4.55,0-6.7,3.62-10.48,10.25-0.77-4.16-2.7-9.56-7.48-9.56-5.39,0-11.64,7.71-17.34,12.48-2.62,2.23-5.47,3.62-7.78,3.62S41.16,28.26,41.16,24c1.7-6.94,2.54-8.71,5.16-8.71,1.77,0,2.54,1,2.54,3.08A56.78,56.78,0,0,1,47.41,29c2.54-.77,6.4-4,9.63-7.48A11,11,0,0,0,46.4,14.69C36.62,14.69,28,23.48,28,33.34c0,6.78,4.85,11.94,12.41,11.94,12.48,0,17.72-10.79,17.72-18.34,0-1.08-.08-1.85-0.15-2.85C59.89,22,62.36,20,64.36,20c2.31,0,4.16,5.78,5.93,14.49-1.62,1.77-3.24,5.16-4,5.78-0.31-3.08-2.39-5-5.09-5-3.08,0-5.16,2.93-5.16,5.39a4.37,4.37,0,0,0,4.47,4.62c5.32,0,6.78-5,10.1-9.48,1,4.78,3.39,9.48,7.48,9.48,4.85,0,9.32-4.16,11.64-7.09l-0.46-.69c-1.46,1.46-2.93,2.39-4.62,2.39-3,0-5.16-6.47-6.78-14.33,1-1.31,2.54-4.7,3.62-5.93A6.35,6.35,0,0,0,87.25,23.63Z");

        var dt = moment(new Date()).format('MMM D, YYYY');
        var info = svg.append('g')
                      .attr('class', 'info')
                      .attr('font-family', 'Nitti')
                      .attr('font-size', '22px')
                      .attr('fill', '#777777')
                      .attr('transform', 'translate(5,765)');

        info.append('text').html('Source: Robert Wood Johnson Foundation');
        info.append('text')
            .attr('y', 25)
            .html('As of '+dt);
    ***REMOVED***
  ***REMOVED***

  $('#form-submit').on('click', function()***REMOVED***
    var control=Alpaca($("#form").get());
    formData = control.getValue();
    formData.select_year = '2017';
    currentYear = formData.select_year;
    if(formData['scenario'] && formData['scenario'] === 'hypothetical')***REMOVED***
      d3.select('#loading-animation').style('display', 'block');
      window.dataAdapter.getPreviewProviderCount()
        .then(drawMap)
        .catch(function(err)***REMOVED***
          // handle error here
          console.log(err);
        ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      window.dataAdapter.getProviderCount(currentYear)
      .then(drawMap)
      .catch(function(err)***REMOVED***
        // handle error here
        console.log(err);
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***);


  d3.select("#save").on("click", function()***REMOVED***
    d3.select('canvas').attr('width', 900).attr('height', 800);
    var tName = currentYear;
    if(formData['map_type'] === 'state')***REMOVED***
      tName = formData['state_select']+'_'+currentYear;
    ***REMOVED***
    console.log(formData['scenario'])
    if(formData['scenario'] === 'hypothetical')***REMOVED***
      tName += '_selected';
    ***REMOVED***
    var flapjack = Pancake("svg-map");
    flapjack.download(tName+'_providers.png');
  ***REMOVED***);

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();

    currentYear = '2017';
    window.dataAdapter.ready()
    .then(function()***REMOVED***
      window.dataAdapter.getProviderCount(currentYear)
        .then(drawMap)
        .catch(function(err)***REMOVED***
          // handle error here
          console.log(err);
        ***REMOVED***);
    ***REMOVED***).catch(function(err)***REMOVED***
      // handle error here
      console.log(err);
    ***REMOVED***);


    $("#form").alpaca(***REMOVED***
        "schema": ***REMOVED***
            "type": "object",
            "properties": ***REMOVED***
              "image_title": ***REMOVED***
                "title": "Image title"
              ***REMOVED***,
              "map_type": ***REMOVED***
                "required": true,
                "default": "U.S.",
                "enum": ["U.S.", "state"]
              ***REMOVED***,
              "state_select": ***REMOVED***
                "title": "Select state",
                "type": "string",
                "required": true,
                "default": "AL",
                "enum": ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
                "dependencies": "map_type"
              ***REMOVED***,
              "scenario_label": ***REMOVED***
                "type": "string",
                "title": "Which type of data would you like to display?"
              ***REMOVED***,
              "scenario": ***REMOVED***
                "required": true,
                "default": 'actual',
                "enum": [
                  'actual',
                  'hypothetical'
                ]
              ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
        "options": ***REMOVED***
          "fields": ***REMOVED***
            "map_type": ***REMOVED***
              "vertical": false,
              "optionLabels": [
                "<span>U.S.</span>",
                "<span>state</span>"
              ]
            ***REMOVED***,
            "state_select": ***REMOVED***
              "type": "select",
              "optionLabels": [
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
              "dependencies": ***REMOVED***
                "map_type": "state"
              ***REMOVED***
            ***REMOVED***,
            "select_year": ***REMOVED***
              "type": "select",
              "dependencies": ***REMOVED***
                "map_num": "single"
              ***REMOVED***
            ***REMOVED***,
            "scenario_label":***REMOVED***
              "type": "hidden"
            ***REMOVED***,
            "scenario": ***REMOVED***
              "optionLabels": [
                "<span>actual</span>",
                "<span>hypothetical</span>"
              ]
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
    $('.radio.alpaca-control').css('display', 'flex');
  ***REMOVED***);

***REMOVED***)();
