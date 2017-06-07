function plot_visualization_1(){

// set the dimensions and margins of the graph
var margin = {top: 50, right: 20, bottom: 30, left: 60},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var color = d3.scaleOrdinal()
  .domain(["0", "1"])
  .range(["#b5d1ff", "#c10108" ]);

svgs = []
for (i = 0 ;i <17 ;i++){
  $("#question3").append("<div id=\"vis3plot"+i+"\" class =\"multiplePlots\"></div>")
  var svg = d3.select("#vis3plot"+i).append("svg").attr("id", "vis3svg"+i)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  svgs.push(svg)
}

recommenders = ["BiasedMatrixFactorization","BiPolarSlopeOne","CoClustering","Constant","Constant5","FactorWiseMatrixFactorization","GlobalAverage","ItemAverage","LatentFeatureLogLinearModel","MatrixFactorization","Random","SigmoidSVDPlusPlus","SlopeOne","TimeAwareBaseline","TimeAwareBaselineWithFrequencies","UserAverage","UserItemBaseline"]

// Get the data
d3.csv("../data/user_2d.csv", function(error, dataAll) {
  if (error) throw error;

  for (var i = 0; i < recommenders.length; i++) {
    rec = recommenders[i]
    data = dataAll.filter(function(r){return r.RS ===rec}) 

    svgs[i].append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          // .style("text-decoration", "underline")  
          .text(rec);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.TSNE_0; }));
    y.domain(d3.extent(data, function(d) { return d.TSNE_1; }));

    // Add the scatterplot
    svgs[i].selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 3)
        .style("fill-opacity", .6)
        .attr("cx", function(d) { return x(d.TSNE_0); })
        .attr("cy", function(d) { return y(d.TSNE_1); })
        .style("fill", function(d) { return color(d.label); });

    // Add the X Axis
    svgs[i].append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svgs[i].append("g")
        // .attr("transform", "translate("+width+",0)")
        .call(d3.axisLeft(y));
    }
});

}