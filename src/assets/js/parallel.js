usersAVGErrors = [];

var margin = {top: 70, right: 10, bottom: 10, left: 10},
    width = 1300 - margin.left - margin.right,
    height = 570 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    y = {},
    dragging = {};


var line = d3.line(),    
    background,
    foreground,
    extents;

var svg = d3.select("#question1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var drawParallel = function (models) {    
      svg.selectAll("g").remove();
      // Each model is an dimension of the visualization                             
      x.domain(dimensions = d3.keys(models[0]).filter(function(d) {    
      if(d == "userId") return false;
      return y[d] = d3.scaleLinear()
                      .domain([0,5])
                      .range([height, 0]);
      }));             

      extents = usersAVGErrors.map(function(p) { return [0,0]; });
      
      // When the range filter be applied, we will show the 'unselected' users in gray
      background = svg.append("g")
          .attr("class", "background")
          .selectAll("path")
          .data(models)
          .enter().append("path")
          .attr("d", path);

      // Default color for users, when the range filter be applied
      // it will color the selected users too
      foreground = svg.append("g")
          .attr("class", "foreground")
          .selectAll("path")
          .data(models)
          .enter().append("path")
          .attr("d", path);

      // Create a group for each model(dimension)
      var g = svg.selectAll(".dimension")
          .data(dimensions)
          .enter().append("g")
          .attr("class", "dimension")
          .attr("transform", function(d) {  return "translate(" + x(d) + ")"; })            
          .call(d3.drag()
            .subject(function(d) { return {x: x(d)}; })
            .on("start", function(d) {
              dragging[d] = x(d);
              background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
              dragging[d] = Math.min(width, Math.max(0, d3.event.x));
              foreground.attr("d", path);          
              // When the current model being dragger pass another model, change the positons (swap)
              dimensions.sort(function(a, b) { return positionFunc(a) - positionFunc(b); });
              x.domain(dimensions);
              g.attr("transform", function(d) { return "translate(" + positionFunc(d) + ")"; })
            })
            .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background.attr("d", path)
                          .transition()
                         .delay(500)
                         .duration(0)
                         .attr("visibility", null);
            }));

      // Add y axis and captions
      g.append("g")
        .attr("class", "axis")
        .each(function(d) { 
                d3.select(this).call(d3.axisLeft(y[d]));
              })    
        .append("text")    
        .attr("fill", "black")    
        .attr("transform", "translate(0,-45) rotate(-90)")    
        .style("text-anchor", "left")
        .attr("class", "bigTitle")    
        .attr("y", -9) 
        .text(function(d) { return d; });
}

var plotVisualization1 = function () {
    console.log("Plotting Visualization 1.");

    //Load full data only on the first time
    if(usersAVGErrors.length == 0)
    d3.csv("../data/user_avg_errors_pivoted.csv", function(error, models) {
        usersAVGErrors = models; 
        plotVisualization1();
    });
    else    
       pagination(usersAVGErrors);           
}

// Movement function to order models
function positionFunc(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

// Transition for the dimensions movement
function transition(g) {
  return g.transition().duration(500);
}

// Create the line between models(dimensions)
function path(d) {
  return line(dimensions.map(function(p) { return [positionFunc(p), y[p](d[p])]; }));
}

$("#previousPage").on('click', decreasePage);
$("#nextPage").on('click', increasePage);