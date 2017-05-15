/* globals DataAdapter */
//= require _data_adapter
(function() ***REMOVED***
  // Application code goes here
  var stateIdx = ['WA', 'MT', 'ID', 'ND', 'WI', 'ME', 'MI', 'WI', 'OR', 'SD', 'NH', 'VT', 'NY', 'WY', 'IA', 'NE', 'MA', 'IL', 'PA', 'CT', 'RI', 'CA', 'UT', 'NV', 'OH', 'IN', 'NY', 'CO', 'WV', 'MO', 'KS', 'DE', 'MD', 'VA', 'KY', 'DC', 'AZ', 'OK', 'NM', 'TN', 'NC', 'TX', 'AR', 'SC', 'AL', 'GA', 'MS', 'LA', 'FL', 'HI', 'AR'];
  var tester;

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      formData = ***REMOVED***
        'map_type': "U.S.",
        'map_num': "single",
        'select_year': "2017",
        'election_results': false
      ***REMOVED***,
      currentYear,
      active = d3.select(null);

  var projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);
  // var projection = d3.geoMercator()
  //     .scale(100)
  //     .translate([width / 2, height / 2]);

  var zoom = d3.zoom()
      .on("zoom", zoomed);

  var initialTransform = d3.zoomIdentity
      .translate(0,0)
      .scale(1);

  var path = d3.geoPath()
      .projection(projection);

  svg.on("click", stopped, true);

  // svg.append("rect")
  //     .attr("class", "background")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .on("click", reset);
  //
  // var g = svg.append("g").attr('class', 'counties');
  // var x = d3.scaleLinear()
  //     .domain([0, 4])
  //     .rangeRound([600, 860]);
  // var color = d3.scaleThreshold()
  //     .domain(d3.range(0, 4))
  //     .range(d3.schemeBlues[5]);
  //
  // svg
  //     .call(zoom) // delete this line to disable free zooming
  //     .call(zoom.transform, initialTransform);

  // g.selectAll("rect")
  //   .data(color.range().map(function(d) ***REMOVED***
  //       d = color.invertExtent(d);
  //       if (d[0] == null) d[0] = x.domain()[0];
  //       if (d[1] == null) d[1] = x.domain()[1];
  //       return d;
  //     ***REMOVED***))
  //   .enter().append("rect")
  //     .attr("height", 8)
  //     .attr("x", function(d) ***REMOVED*** return x(d[0]) - 32.5; ***REMOVED***)
  //     .attr("width", function(d) ***REMOVED*** return x(d[1]) - x(d[0]); ***REMOVED***)
  //     .attr("fill", function(d) ***REMOVED*** return color(d[0]); ***REMOVED***);
  //
  // g.append("text")
  //     .attr("class", "caption")
  //     .attr("x", x.range()[0] - 32.5)
  //     .attr("y", -6)
  //     .attr("fill", "#000")
  //     .attr("text-anchor", "start")
  //     .attr("font-weight", "bold")
  //     .text("Number of ACA insurers available");
  //
  // g.call(d3.axisBottom(x)
  //     .tickFormat(function(x, i) ***REMOVED***
  //       if(x === 3)***REMOVED***
  //         return x + '+';
  //       ***REMOVED*** else ***REMOVED***
  //         return x;
  //       ***REMOVED***
  //     ***REMOVED***)
  //     .tickPadding(13)
  //     .tickSize(0)
  //     .tickValues(color.domain()))
  //   .select(".domain")
  //     .remove();

  function clicked() ***REMOVED***
    // if (active.node() === this) return reset();
    // active.classed("active", false);
    // active = d3.select(this).classed("active", true);

    var bounds = path.bounds(tester),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    var transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);

    d3.selectAll('.counties').transition()
        .duration(750)
        // .attrTween('transform', function() ***REMOVED***
        //             return d3.interpolateString('translate(0,0) rotate(0)','translate(0,0)' +
        //                    'rotate(-15, 0, 0)');
        //         ***REMOVED***)
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
    // var ctrans = d3.selectAll('.counties').attr('transform');
    // d3.selectAll('.counties').attr('transform', ctrans+' rotate(90, 0, 0)');
    // console.log()
  ***REMOVED***

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() ***REMOVED***
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  ***REMOVED***

  // var gg = svg.append("g").attr("class", "counties");

  function drawMap(data)***REMOVED***
    console.log(formData);
    svg.html('');
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g").attr('class', 'counties');
    var x = d3.scaleLinear()
        .domain([0, 4])
        .rangeRound([600, 860]);
    var color = d3.scaleThreshold()
        .domain(d3.range(0, 4))
        .range(d3.schemeBlues[5]);

    svg
        .call(zoom) // delete this line to disable free zooming
        .call(zoom.transform, initialTransform);

    d3.queue()
        // .defer(d3.json, "https://d3js.org/us-10m.v1.json")
        .defer(d3.json, "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json")
        .await(ready);

    function ready(error, us) ***REMOVED***
      var tj = topojson.feature(us, us.objects.counties).features;
      if (error) throw error;

      if(formData['map_type'] === 'state')***REMOVED***
        tester = topojson.feature(us, us.objects.states).features[_.indexOf(stateIdx, formData['state_select'])];
        // tj = topojson.feature(us, us.objects.counties).features.filter(function(d)***REMOVED***
        //   if(_.contains(state_fips[formData['state_select']], d.id))***REMOVED***
        //     return d;
        //   ***REMOVED***
        // ***REMOVED***);
        // d3.selectAll('path').attr('fill', 'none').attr('stroke', 'none');
        d3.selectAll('.counties').attr('stroke', 'none').attr('fill', 'none');
        clicked();
      ***REMOVED*** else ***REMOVED***
        d3.selectAll('.counties').attr('stroke', '#ccc').attr('fill', '#ccc');
      ***REMOVED***

      var stf = [];
      stf = state_fips[formData['state_select']];
      // gg
       svg.append("g").attr("class", "counties paths").selectAll("path")
          .data(tj)
        .enter().append("path")
          .attr('id', function(d)***REMOVED***
            return 'f_'+d.id;
          ***REMOVED***)
          .attr("fill", function(d) ***REMOVED***
            if(String(d.id).length === 4)***REMOVED***
              d.id = '0'+String(d.id);
            ***REMOVED***
            if(formData['map_type'] === 'state')***REMOVED***
              // console.log(d.id);
              if(_.contains(stf, String(d.id)))***REMOVED***
                return color(d.count = data[d.id]);
              ***REMOVED*** else ***REMOVED***
                return '#fff';
              ***REMOVED***
            ***REMOVED*** else ***REMOVED***
              if(color(d.count = data[d.id]))***REMOVED***
                return color(d.count = data[d.id]);
              ***REMOVED*** else ***REMOVED***
                return '#ccc';
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***)
          .attr("d", path)
          .attr("stroke", function(d)***REMOVED***
            if(d.count)***REMOVED*** return '#fff'; ***REMOVED***
          ***REMOVED***)
          .attr('stroke-width', '0.5px')
        .append("title")
          .text(function(d) ***REMOVED*** return d.count; ***REMOVED***);

      // if(d3.select('.mesh')['_groups'][0][0] === null)***REMOVED***
        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) ***REMOVED*** return a !== b; ***REMOVED***))
            .attr("class", "mesh")
            .attr("d", path)
            .attr('fill', 'none')
            .attr('stroke', '#fff')
      // ***REMOVED*** else ***REMOVED***
        if(formData['map_type'] === 'state')***REMOVED***
          d3.selectAll('.mesh').style('display', 'none');
        ***REMOVED*** else ***REMOVED***
          d3.selectAll('.mesh').style('display', 'block');
        // ***REMOVED***
      ***REMOVED***

      // svg.append("g")
      //     .attr("class", "counties")
      //   .selectAll("path")
      //   .data(tj)
      //   .enter().append("path")
      //     .attr("fill", function(d) ***REMOVED***
      //       if(String(d.id).length === 4)***REMOVED***
      //         d.id = '0'+String(d.id);
      //       ***REMOVED***
      //       if(color(d.count = data[d.id]))***REMOVED***
      //         return color(d.count = data[d.id]);
      //       ***REMOVED*** else ***REMOVED***
      //         return '#ccc';
      //       ***REMOVED***
      //     ***REMOVED***)
      //     .attr("d", path)
      //     .attr("stroke", function(d)***REMOVED***
      //       if(d.count)***REMOVED*** return '#fff'; ***REMOVED***
      //     ***REMOVED***)
      //     .attr('stroke-width', '0.5px')
      //     .on("click", clicked)
      //   .append("title")
      //     .text(function(d) ***REMOVED*** return d.count; ***REMOVED***);
      //
      // svg.append("path")
      //     .datum(topojson.mesh(us, us.objects.states, function(a, b) ***REMOVED*** return a !== b; ***REMOVED***))
      //     .attr("class", "states")
      //     .attr("d", path)
      //     .attr('fill', 'none')
      //     .attr('stroke', function()***REMOVED***
      //       if(formData['map_type'] === 'state')***REMOVED***
      //         return 'none';
      //       ***REMOVED*** else ***REMOVED***
      //         return '#fff';
      //       ***REMOVED***
      //     ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

  $('#form-submit').on('click', function()***REMOVED***
    var control=Alpaca($("#form").get());
    formData = control.getValue();
    currentYear = formData.select_year;
    window.dataAdapter.getProviderCount(currentYear, drawMap);
  ***REMOVED***);




  // required for downloading a PNG of the map(s)
  var svg2 = document.querySelector('svg');
  var canvas = document.querySelector('canvas');

  function triggerDownload (imgURI) ***REMOVED***
    var evt = new MouseEvent('click', ***REMOVED***
      view: window,
      bubbles: false,
      cancelable: true
    ***REMOVED***);

    var a = document.createElement('a');
    a.setAttribute('download', currentYear+'_providers.png');
    a.setAttribute('href', imgURI);
    a.setAttribute('target', '_blank');

    a.dispatchEvent(evt);
  ***REMOVED***

  d3.select("#save").on("click", function()***REMOVED***
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // lets get the resolution of our device.
    var pixelRatio = 2;

    // lets scale the canvas and change its CSS width/height to make it high res.
    canvas.style.width = canvas.width +'px';
    canvas.style.height = canvas.height +'px';
    canvas.width *= pixelRatio;
    canvas.height *= pixelRatio;

    // Now that its high res we need to compensate so our images can be drawn as
    //normal, by scaling everything up by the pixelRatio.
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);

    var data = (new XMLSerializer()).serializeToString(svg2);
    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image();
    var svgBlob = new Blob([data], ***REMOVED***type: 'image/svg+xml;charset=utf-8'***REMOVED***);
    var url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () ***REMOVED***
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);

      var imgURI = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');

      triggerDownload(imgURI);
    ***REMOVED***;

    img.src = url;
  ***REMOVED***);

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();

    /* TODO: REMOVE THIS COMMENT.
     Casey, I refactored the provider count fx. So changed the line below. Also you can directly pass in the fucntion name you want to call. The parameter ('data' in this case) gets automatically assigned.
     One other thing that might possibly affect what you have already done is that Fips codes are now always 5 digits with leading 0's if required. this was done to make things consitent across all data sets we have*/
    currentYear = '2017';
    window.dataAdapter.getProviderCount(currentYear, drawMap);

    $("#form").alpaca(***REMOVED***
        "schema": ***REMOVED***
            "type": "object",
            "properties": ***REMOVED***
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
                "enum": ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
                "dependencies": "map_type"
              ***REMOVED***,
              "map_num_label":***REMOVED***
                "title": "One year or multiple years?"
              ***REMOVED***,
              "map_num": ***REMOVED***
                "required": true,
                "default": "single",
                "enum": ["single", "multiple"]
              ***REMOVED***,
              "select_year": ***REMOVED***
                "title": "Select year",
                "type": "string",
                "required": true,
                "default": '2017',
                "enum": [
                  '2014',
                  '2015',
                  '2016',
                  '2017'
                ],
                "dependencies": "map_num"
              ***REMOVED***,
              "select_years": ***REMOVED***
                "title": "Select years",
                "type": "array",
                "enum": [
                  '2014',
                  '2015',
                  '2016',
                  '2017'
                ],
                "dependencies": "map_num"
              ***REMOVED***,
              "election_results": ***REMOVED***
                "dependencies": "select_year"
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
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
              "dependencies": ***REMOVED***
                "map_type": "state"
              ***REMOVED***
            ***REMOVED***,
            "map_num_label":***REMOVED***
              "type": "hidden"
            ***REMOVED***,
            "map_num": ***REMOVED***
              "vertical": false,
              "sort": false,
              "optionLabels": [
                "<span>single</span>",
                "<span>multiple</span>"
              ]
            ***REMOVED***,
            "select_year": ***REMOVED***
              "type": "select",
              "dependencies": ***REMOVED***
                "map_num": "single"
              ***REMOVED***
            ***REMOVED***,
            "select_years": ***REMOVED***
              "type": "checkbox",
              "dependencies": ***REMOVED***
                "map_num": "multiple"
              ***REMOVED***
            ***REMOVED***,
            "election_results": ***REMOVED***
              "type": "checkbox",
              "rightLabel": "Add 2016 election results",
              "dependencies": ***REMOVED***
                "select_year": "2017"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
    $('.radio.alpaca-control').css('display', 'flex');
  ***REMOVED***);

***REMOVED***)();
