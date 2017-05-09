//= require _data_adapter


/* If you would like to use Javascript templates, you can enable them by adding
 * the following line to the top of this file
 *   //=require_tree ./_templates
 * you can then use the templates like this:
 *   var template = window.JST['_templates/example'];
 *   var html = template(***REMOVED***my_var: 'Hello!', list: [1, 2, 3, 4]***REMOVED***);
 *   $('#example').html(html);
 * Template files should have the extension `.jst.ejs` to be properly loaded.
 */

(function() ***REMOVED***
  // Application code goes here

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
    console.log('hello, is this krusty crab?');
    // Initialize lazy load
    $('.lazy').lazyload(***REMOVED***
      threshold : 0,
      failure_limit: 999,
      effect: 'fadeIn',
      data_attribute_queries: [
        ***REMOVED***media: "(max-width: 1600px)", data_name: "x-large"***REMOVED***,
        ***REMOVED***media: "(max-width: 1200px)", data_name: "large"***REMOVED***,
        ***REMOVED***media: "(max-width: 900px)", data_name: "medium"***REMOVED***,
        ***REMOVED***media: "(max-width: 640px)", data_name: "small"***REMOVED***,
        ***REMOVED***media: "(max-width: 400px)", data_name: "x-small"***REMOVED***
      ]
    ***REMOVED***);
    DataAdapter.getCoverage17();

    // Kinto client documentation at https://doc.esdoc.org/github.com/Kinto/kinto-client/#collections
    // You can now access collections and records in Kinto like this
    // var myCollection = kintoBucket.collection('YOUR_COLLECTION_NAME');
    // myCollection.createRecord(***REMOVED***test:'value'***REMOVED***);
    // myCollection.listRecords().then(function(data) ***REMOVED***console.log(data);***REMOVED***);

    // Initialize your code here
  ***REMOVED***);
***REMOVED***)();
