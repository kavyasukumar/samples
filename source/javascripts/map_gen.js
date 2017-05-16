/* globals DataAdapter */
//= require _data_adapter
//= require _vendor_extra/moment
(function() ***REMOVED***
  // Application code goes here
  var stateIdx = ['WA', 'MT', 'ID', 'ND', 'MN', 'ME', 'MI', 'WI', 'OR', 'SD', 'NH', 'VT', 'NY', 'WY', 'IA', 'NE', 'MA', 'IL', 'PA', 'CT', 'RI', 'CA', 'UT', 'NV', 'OH', 'IN', 'NY', 'CO', 'WV', 'MO', 'KS', 'DE', 'MD', 'VA', 'KY', 'DC', 'AZ', 'OK', 'NM', 'TN', 'NC', 'TX', 'AR', 'SC', 'AL', 'GA', 'MS', 'LA', 'FL', 'HI', 'AK'];
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

  var zoom = d3.zoom()
      .on("zoom", zoomed);

  var initialTransform = d3.zoomIdentity
      .translate(0,0)
      .scale(1);

  // var projection = d3.geoMercator()
  //     .scale(100)
  //     .translate([width / 2, height / 2]);
  //
  var path = d3.geoPath()
      .projection(projection);

  svg.on("click", stopped, true);

  var x = d3.scaleLinear()
      .domain([0, 4])
      .rangeRound([600, 860]);
  var color = d3.scaleThreshold()
      .domain(d3.range(0, 4))
      .range(d3.schemeBlues[5]);

  // svg
  //     .call(zoom) // delete this line to disable free zooming
  //     .call(zoom.transform, initialTransform);

  function drawScale()***REMOVED***
    var g = svg.append("g").attr('class', 'scale')
               .attr('transform', "translate(0,40)");

    g.selectAll("rect")
      .data(color.range().map(function(d) ***REMOVED***
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        ***REMOVED***))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) ***REMOVED*** return x(d[0]) - 32.5; ***REMOVED***)
        .attr("width", function(d) ***REMOVED*** return x(d[1]) - x(d[0]); ***REMOVED***)
        .attr("fill", function(d) ***REMOVED*** return color(d[0]); ***REMOVED***);

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0] - 32.5)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr('font-family', 'Helvetica')
        .text("Number of ACA insurers available");

    g.call(d3.axisBottom(x)
        .tickFormat(function(x, i) ***REMOVED***
          if(x === 3)***REMOVED***
            return x + '+';
          ***REMOVED*** else ***REMOVED***
            return x;
          ***REMOVED***
        ***REMOVED***)
        .tickPadding(13)
        .tickSize(0)
        .tickValues(color.domain()))
      .select(".domain")
        .remove();
  ***REMOVED***

  function clicked() ***REMOVED***
    // if (active.node() === this) return reset();
    // active.classed("active", false);
    // active = d3.select(this).classed("active", true);

    var bounds = path.bounds(tester),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.7 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

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

    if(formData['map_type'] === 'state')***REMOVED***
      projection = d3.geoMercator()
                      .center([43.09, -79.06])
                      .scale(800)
                      .translate([width / 2, height / 2]);
    ***REMOVED*** else ***REMOVED***
      projection = d3.geoAlbersUsa()
                      .scale(1000)
                      .translate([width / 2, height / 2]);
    ***REMOVED***

    path.projection(projection);

    console.log(formData);
    svg.html('');
    if(formData['image_title'])***REMOVED***
      svg.append('g').attr('font-family', 'Helvetica')
          .append("text")
          .attr('class', 'title')
          .attr('x', 25)
          .attr('y', 50)
          .attr("font-weight", "bold")
          .text(formData['image_title']);
    ***REMOVED***
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", 'none');

    drawScale();

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

      var stf = [];
      stf = state_fips[formData['state_select']];
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
                if(color(d.count = data[d.id]))***REMOVED***
                  return color(d.count = data[d.id]);
                ***REMOVED*** else ***REMOVED***
                  return '#ccc';
                ***REMOVED***
              ***REMOVED*** else ***REMOVED***
                return 'none';
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

        svg.append("path")
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
      ***REMOVED***
      svg.append('g')
          .attr('class', 'vox-logo')
          .attr('transform', 'translate(770,560)')
          .attr('preserveAspectRatio', "none")
          .append('path')
          .attr('d', "M24.34,6.27h0.75l0.09-.35H15.76l-0.09.35H17a2.18,2.18,0,0,1,2.16,2.47,9.45,9.45,0,0,1-1.06,3.57L12,25.82,10.52,8.25c-0.13-1.37.57-2,2.11-2h0.88l0.09-.35H0.3l-0.13.35H1c1.06,0,1.45.66,1.54,1.89L4.92,30.88h5.59L19.89,11C21.35,8.07,22.85,6.27,24.34,6.27ZM23.24,31c-0.84,0-1.37-.26-1.37-1.67a50.71,50.71,0,0,1,1.37-8.41,2.89,2.89,0,0,0,2.6,2.91,6.6,6.6,0,0,0,1-.09C25.4,29.74,24.87,31,23.24,31ZM49.93,19a3,3,0,0,0,2.91-3.13,2.38,2.38,0,0,0-2.47-2.47c-2.6,0-3.83,2.07-6,5.86-0.44-2.38-1.54-5.46-4.27-5.46-3.08,0-6.65,4.4-9.91,7.13A7.53,7.53,0,0,1,25.75,23c-1.37,0-2.16-1.37-2.16-3.79,1-4,1.45-5,3-5,1,0,1.45.57,1.45,1.76a32.44,32.44,0,0,1-.84,6.08c1.45-.44,3.65-2.29,5.5-4.27a6.26,6.26,0,0,0-6.08-3.92A10.91,10.91,0,0,0,16.06,24.59c0,3.88,2.77,6.83,7.09,6.83,7.13,0,10.13-6.16,10.13-10.48,0-.62,0-1.06-0.09-1.63C34.29,18.11,35.7,17,36.85,17c1.32,0,2.38,3.3,3.39,8.28-0.92,1-1.85,3-2.29,3.3A2.92,2.92,0,0,0,35,25.69a3.12,3.12,0,0,0-3,3.08,2.5,2.5,0,0,0,2.55,2.64c3,0,3.88-2.86,5.77-5.42,0.57,2.73,1.94,5.42,4.27,5.42,2.77,0,5.33-2.38,6.65-4.05L51.07,27a3.8,3.8,0,0,1-2.64,1.37c-1.72,0-3-3.7-3.88-8.19,0.57-.75,1.45-2.69,2.07-3.39A3.63,3.63,0,0,0,49.93,19Z")
          .attr('fill', '#000');

      var dt = moment(new Date()).format('MMM D, YYYY');
      var info = svg.append('g')
                    .attr('class', 'info')
                    .attr('font-family', 'Helvetica')
                    .attr('transform', 'translate(70,575)');

      info.append('text').html('Source: Robert Wood Johnson Foundation');
      info.append('text')
          .attr('y', 20)
          .html(dt);


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
    var tName = currentYear;
    if(formData['map_type'] === 'state')***REMOVED***
      tName = formData['state_select']+'_'+currentYear;
    ***REMOVED***
    a.setAttribute('download', tName+'_providers.png');
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
                "enum": ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
                "dependencies": "map_type"
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
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
              "dependencies": ***REMOVED***
                "map_type": "state"
              ***REMOVED***
            ***REMOVED***,
            "select_year": ***REMOVED***
              "type": "select",
              "dependencies": ***REMOVED***
                "map_num": "single"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
    $('.radio.alpaca-control').css('display', 'flex');
  ***REMOVED***);

***REMOVED***)();
