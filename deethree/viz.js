'use strict';
var start = performance.now();

var h = 1000;
var w = 1400;
var pad = 50;
var radius = 5;
var svg, xScale, yScale;

function init() {
  d3.json('metrics.json', (err, data) => {
    if (err)
      console.log(err);
    else {
      svg = d3.select('body').append('svg').attr({ width: w, height: h });

      plot(data, 'activities', 1, 'stringify', 1);
    }
  });
}

function plot(data, xKey, xDiv, yKey, yDiv) {
  xScale = createScale(data.api, 0, xKey, pad + 5, w - pad, xDiv);
  yScale = createScale(data.api, 0, yKey, h - pad, 10, yDiv);
  addAxis(xScale, 'bottom', 0, h - pad);
  addAxis(yScale, 'left', pad, 0);
  addCircleGroup(data.api, 'black', xKey, xDiv, yKey, yDiv);
  addCircleGroup(data.apigz, 'red', xKey, xDiv, yKey, yDiv);

  console.log(performance.now() - start + ' ms');
}

function createScale(ds, dmin, key, rmin, rmax, div) {
  var scale = d3.scale.linear()
    .domain([dmin, d3.max(ds, (d) => d[key] / div)])
    .range([rmin, rmax]);
  return scale;
}

function addAxis(scale, position, x, y) {
  var axis = d3.svg.axis().scale(scale).orient(position);
  svg.append('g').call(axis).attr({
    class: 'axis',
    transform: 'translate(' + x + ',' + y + ')'
  })
}

function addCircleGroup(ds, fill, xKey, xDiv, yKey, yDiv) {
  svg.append('g').selectAll('circle').data(ds).enter().append('circle')
    .attr({
      cx: (d) => xScale(d[xKey] / xDiv),
      cy: (d) => yScale(d[yKey] / yDiv),
      r: radius,
      "fill": fill
    });
}