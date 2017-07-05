function drawScatterPlots(perp){  
  $("#question3").empty();
  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 20, bottom: 30, left: 60},
      width3 = 300 - margin.left - margin.right,
      height3 = 300 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width3]);
  var y = d3.scaleLinear().range([height3, 0]);

  var color = d3.scaleOrdinal()
    .domain(["0", "1"])
    .range(["#b5d1ff", "#c10108" ]);


  svgs = []  
  for (i = 0 ;i <17 ;i++){
    $("#question3").append("<div id=\"vis3plot"+i+"\" class =\"multiplePlots\"></div>")
    var svg = d3.select("#vis3plot"+i).append("svg").attr("id", "vis3svg"+i)
        .attr("width", width3 + margin.left + margin.right)
        .attr("height", height3 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    svgs.push(svg)
  }

  recommenders = ["BiasedMatrixFactorization","BiPolarSlopeOne","CoClustering","Constant","Constant5","FactorWiseMatrixFactorization","GlobalAverage","ItemAverage","LatentFeatureLogLinearModel","MatrixFactorization","Random","SigmoidSVDPlusPlus","SlopeOne","TimeAwareBaseline","TimeAwareBaselineWithFrequencies","UserAverage","UserItemBaseline"]
  
  // Get the data
  d3.csv("./data/user_2d.csv").on("progress", function(evt) {
        // console.log("Amount loaded: " + evt.loaded)
    })
    .get(function(error,dataAll) {        
    
    if (error) throw error;    

    dataAll = dataAll.filter(function(r){ return r.perplexity == perp; })
    for (var i = 0; i < recommenders.length; i++) {
      rec = recommenders[i]
      data = dataAll.filter(function(r){return r.RS ===rec})      

      svgs[i].append("text")
            .attr("x", (width3 / 2))             
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
          .attr("transform", "translate(0," + height3 + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svgs[i].append("g")
          // .attr("transform", "translate("+width+",0)")
          .call(d3.axisLeft(y));
      }
  });  
}

var plotVisualization3 = function() {
  console.log("Plotting Visualization 3.");
  // Interation functionality 
  var svgSlider = d3.select("#sliderForPerplexity")
      margin = {right: 50, left: 50},
      width4 = +svgSlider.attr("width") - margin.left - margin.right,
      height4 = +svgSlider.attr("height");

  svgSlider.append("text")
    .text("t-sne Perplexity:")
    .attr("x", 10)
    .attr("y", 60)
    .attr("font-family", "sans-serif")
    .attr("font-size", "18px")
    .attr("fill", "black");
  var x = d3.scaleLinear()
      .domain([5, 50])
      .range([0, width4])
      .clamp(true);

  var slider = svgSlider.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height4 / 2 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); replot(x.invert(d3.event.x))})
          .on("start drag", function() { position(x.invert(d3.event.x)); }));

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
      .attr("x", x)
      .attr("text-anchor", "middle")
      .text(function(d) { return d});

  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  function position(h) {    
    value = Math.max(Math.min(x(h),300),0)  
    handle.attr("cx", value);  
  }
  function replot(h){
    perplexity = String(Math.floor(h))
    console.log(perplexity)
    drawScatterPlots(perplexity);  
  }

  drawScatterPlots("5");
};