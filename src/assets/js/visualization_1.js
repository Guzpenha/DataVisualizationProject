function plot_visualization_1(){

// set the dimensions and margins of the graph
var margin = {top: 50, right: 20, bottom: 30, left: 60},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var color = d3.scaleOrdinal()
  .domain(["0", "1"])
  .range(["#b5d1ff", "#c10108" ]);

var svg = d3.select("#question3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Get the data
d3.csv("../data/user_2d.csv", function(error, data) {
  if (error) throw error;

  data = data.filter(function(r){return r.RS ==="BiasedMatrixFactorization"})  
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text("BiasedMatrixFactorization");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.TSNE_0; }));
  y.domain(d3.extent(data, function(d) { return d.TSNE_1; }));

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .style("fill-opacity", .6)
      .attr("cx", function(d) { return x(d.TSNE_0); })
      .attr("cy", function(d) { return y(d.TSNE_1); })
      .style("fill", function(d) { return color(d.label); });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      // .attr("transform", "translate("+width+",0)")
      .call(d3.axisLeft(y));

});

}