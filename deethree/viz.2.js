'use strict';
var start = performance.now();

var h = 1000;
var w = 1400;
var padding = 50;

function init() {
  d3.json('metrics.json', (err, data) => {
    if (err)
      console.log(err);
    else
      buildPlot(data);
  });
}

function buildPlot(data) {

  var xScale = d3.scale.linear()
    .domain([0, d3.max(data.api, function (d) { return d.docSize / 1000; })])
    .range([padding+5, w-padding]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(data.api, function (d) { return d.e2e; })])
    .range([h - padding, 10]);

  var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxisGen = d3.svg.axis().scale(yScale).orient("left");

  var svg = d3.select("body").append("svg").attr({ width:w, height:h});
  
  var yAxis = svg.append("g").call(yAxisGen)
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ", 0)");
                        
  var xAxis = svg.append("g").call(xAxisGen)
                .attr("class","axis")
                .attr("transform", "translate(0," + (h-padding) + ")");


  
  
  
  var dotsgzGroup = svg.append("g");
  var dotsgz = dotsgzGroup.selectAll("circle")
    .data(data.apigz)
    .enter()
    .append("circle")
    .attr({
      cx: function(d){ return xScale(d.docSize / 1000); },
      cy: function(d){ return yScale(d.e2e); },
      r:  5,
      "fill": "red"
  });

  var dotsGroup = svg.append("g");
  var dots = dotsGroup.selectAll("circle")
    .data(data.api)
    .enter()
    .append("circle")
    .attr({
      cx: function(d){ return xScale(d.docSize / 1000); },
      cy: function(d){ return yScale(d.e2e); },
      r:  5,
      "fill": "black"
  });

  console.log(performance.now() - start + " ms");
}