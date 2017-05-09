(function() ***REMOVED***
  // Application code goes here

  var adapter;
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var planReport = d3.map();

  var path = d3.geoPath();

  var x = d3.scaleLinear()
      .domain([0, 4])
      .rangeRound([600, 860]);

  var color = d3.scaleThreshold()
      .domain(d3.range(1, 4))
      .range(d3.schemeBlues[4]);

  var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(0,40)");

  g.selectAll("rect")
    .data(color.range().map(function(d) ***REMOVED***
        // d = color.invertExtent(d);
        // if (d[0] == null) d[0] = x.domain()[0];
        // if (d[1] == null) d[1] = x.domain()[1];
        return d;
      ***REMOVED***))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) ***REMOVED*** return x(d[0]); ***REMOVED***)
      .attr("width", function(d) ***REMOVED*** return x(d[1]) - x(d[0]); ***REMOVED***)
      .attr("fill", function(d) ***REMOVED*** return color(d[0]); ***REMOVED***);

  g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("planReport rate");

  g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(function(x, i) ***REMOVED*** return i ? x : x + "%"; ***REMOVED***)
      .tickValues(color.domain()))
    .select(".domain")
      .remove();

  d3.queue()
      .defer(d3.json, "https://d3js.org/us-10m.v1.json")
      .defer(d3.csv, "../temp_data/simple_2017.csv", function(d) ***REMOVED*** planReport.set(String(d.fips_code), +d.count); ***REMOVED***)
      .await(ready);

  function ready(error, us) ***REMOVED***
    if (error) throw error;
    var maxVal = _.chain(planReport).values().max().value();
    console.log(maxVal)
    svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
        .attr("fill", function(d) ***REMOVED***
          return color(d.count = planReport.get(d.id)); ***REMOVED***)
        .attr("d", path)
      .append("title")
        .text(function(d) ***REMOVED*** return d.count + "%"; ***REMOVED***);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) ***REMOVED*** return a !== b; ***REMOVED***))
        .attr("class", "states")
        .attr("d", path);
  ***REMOVED***

  $(document).ready(function() ***REMOVED***
    adapter = window.dataAdapter || DataAdapter.getInstance();
  ***REMOVED***);
***REMOVED***)();
