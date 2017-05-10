/* globals DataAdapter */
//= require _data_adapter
(function() ***REMOVED***
  // Application code goes here

  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    currentYear,
    formData;

  var planReport = d3.map();

  var path = d3.geoPath();

  var x = d3.scaleLinear()
      .domain([0, 4])
      .rangeRound([600, 860]);

  var color = d3.scaleThreshold()
      .domain(d3.range(0, 4))
      .range(d3.schemeBlues[5]);

  var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(32.5,40)");

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

  function drawMap(data)***REMOVED***
    d3.queue()
        .defer(d3.json, "https://d3js.org/us-10m.v1.json")
        .await(ready);

    function ready(error, us) ***REMOVED***
      if (error) throw error;
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("fill", function(d) ***REMOVED***
            if(color(d.count = data[d.id]))***REMOVED***
              return color(d.count = data[d.id]);
            ***REMOVED*** else ***REMOVED***
              return '#ccc';
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
          .attr("class", "states")
          .attr("d", path)
          .attr('fill', 'none')
          .attr('stroke', '#fff');
    ***REMOVED***
  ***REMOVED***

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

  $('#form-submit').on('click', function()***REMOVED***
    var control=Alpaca($("#form").get());
    // formData = (JSON.stringify(control.getValue(), null, "   "));
    formData = control.getValue();
    currentYear = formData.select_year;
    console.log(currentYear, formData)
    window.dataAdapter.getProviderCount(currentYear, drawMap);
  ***REMOVED***)

  // doesn't get when radio buttons are changed
  // $("#form").change(function()***REMOVED***
  //    console.log('change');
  // ***REMOVED***);

  // triggers twice
  // $("#form").click(function()***REMOVED***
  //   var control=Alpaca($("#form").get());
  //   formData = (JSON.stringify(control.getValue(), null, "   "));
  //   console.log(formData);
  // ***REMOVED***);


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
                "default": "Alabama",
                "enum": [
                  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
                "dependencies": "map_type"
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
            "state_select": ***REMOVED***
              "type": "select",
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
  ***REMOVED***);

***REMOVED***)();
