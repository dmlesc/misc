'use strict';
var start = performance.now();

var h = 700;
var w = 700;
var padding = 40;
var ds;

function init() {
  d3.json('metrics.json', (err, data) => {
    if (err)
      console.log(err);
    else {
      ds = data;
      buildLine();
    }
  });
}

function buildLine() {

  var apiMetrics = ds.api;
  var minDocSize = d3.min(apiMetrics, function (d) { return d.docSize; }) / 1000;

  var xScale = d3.scale.linear()
    .domain([minDocSize, d3.max(apiMetrics, function (d) { return d.docSize / 1000; })])
    .range([padding+5, w-padding]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(apiMetrics, function (d) { return d.e2e; })])
    .range([h - padding, 10]);

  var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxisGen = d3.svg.axis().scale(yScale).orient("left");

  var lineFun = d3.svg.line()
                .x(function (d) {return xScale(d.docSize / 1000); } )
                .y(function (d) {return yScale(d.e2e); })
                .interpolate("linear");
  
  var svg = d3.select("body").append("svg").attr({ width:w, height:h});

  var yAxis = svg.append("g").call(yAxisGen)
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ", 0)");
                        
  var xAxis = svg.append("g").call(xAxisGen)
                .attr("class","axis")
                .attr("transform", "translate(0," + (h-padding) + ")");

  var viz = svg.append("path")
              .attr({
                  d: lineFun(apiMetrics),
                  "stroke" : "purple",
                  "stroke-width": 2,
                  "fill" : "none"
              });

}