/* globals DataAdapter */
//= require _vendor/pancake.stack.min
(function() ***REMOVED***
  // Application code goes here

  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    flapjack;

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
      .tickSize(13)
      // .tickFormat(function(x, i) ***REMOVED*** return i ? x : x + "+"; ***REMOVED***)
      .tickFormat(function(x, i) ***REMOVED***
        if(x === 3)***REMOVED***
          return x + '+';
        ***REMOVED*** else ***REMOVED***
          return x;
        ***REMOVED***
      ***REMOVED***)
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

  d3.select("#save").on("click", function()***REMOVED***
    flapjack = Pancake('svg-map');
    console.log(flapjack)
    flapjack.height = 300;
    flapjack.width = 480;
    console.log(flapjack)
    flapjack.download("2017_providers.png");
  ***REMOVED***);

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();

    window.dataAdapter.getProviderCount17(function(providerCount17)***REMOVED***
      console.log('Here is the provider count for 2017 by fips code || MAP PAGE');
      drawMap(providerCount17);
    ***REMOVED***);
  ***REMOVED***);

***REMOVED***)();
