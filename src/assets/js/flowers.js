var currentData;
var dataScale = 10; // Scale to show data on boxes
var radius = 4; // Circle radius for flower button
var petalColor = "#B4BA00"
var strokeWidth = 3;
var theta = Math.PI * 2 / 11; // Rate for petals angles
var padding = 15;
var dotFill = "white"; // Flowers Buttons colors
var dotStroke = "white";

var margin = {
    top: 20,
    right: 20,
    bottom: 0,
    left: 20
  },
  width = innerWidth - 80;
height = 600 - margin.top - margin.bottom;

var xValue = function(d) {
  return d.country;
};

var yValue = function(d) {
    return countryAverage(d);
  },
  yScale = d3.scaleLinear().range([height, 0]), // value -> display
  yMap = function(d) {
    return yScale(yValue(d));
  }, // data -> display
  yAxis = d3.axisLeft().scale(yScale);

var yMapTranslateRadius = function(d) {
  return yMap(d) + radius;
};

var svg = d3.select("#flowers")
  .append("svg")
  .attr("id", "chart-svg")
  .attr("class", 'flowers-chart')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip extra
var tooltip = d3.select("#flowers").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0.0);

var svgDefs = svg.append('defs');

// TOOO: Change to insert and update pattern
var updateData = function(filter) { 
  var t = d3.transition()
            .duration(500)
            .ease(d3.easeLinear);

  // Clear SVG
  svg.selectAll("*").remove();
  // Load data      
  d3.csv("./data/data.csv", function(error, data) {
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.housing = +d.housing * dataScale;
      d.income = +d.income * dataScale;
      d.jobs = +d.jobs * dataScale;
      d.community = +d.community * dataScale;
      d.education = +d.education * dataScale;
      d.environment = +d.environment * dataScale;
      d.civicengagement = +d['civic engagement'] * dataScale;
      d.health = +d.health * dataScale;
      d.lifesatisfaction = +d['life satisfaction'] * dataScale;
      d.worklife = +d['work-life balance'] * dataScale;
      d.safety = +d.safety * dataScale;
    });

    // sortDataByMetric(data, 'education');

    if(filter == 'lexico')    
      sortDataByName(data);   

    else if(filter == 'avg')
      sortDataByAvg(data);

    else
      sortDataByMetric(data, filter);   
    
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    var x = d3.scalePoint()
      .domain(data.map(function(a) {
        return a.country;
      }))
      .range([0, width]);      

    var xAxis = d3.axisBottom()
                .scale(x);      

    var factor = (width / data.length);
    var petalFactor = 3;

    var xMap = function(d) {
      return data.indexOf(d) * factor
    };

    var xPetalMap = function(d, attrNumber, attribute) {
      return xMap(d) + attribute * petalFactor * Math.cos(theta * attrNumber);
    };
    var yPetalMap = function(d, attrNumber, attribute) {
      return yMap(d) - attribute * petalFactor * Math.sin(theta * attrNumber);
    };

    // y-axis
    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    svg.append("text")
      .text("Dandelion Life Index")
      .attr("x", 0)
      .attr("y", 30)
      .attr("font-family", "sans-serif")
      .attr("font-size", "22px")
      .attr("fill", "000")
      .attr("opacity", 0.1)
      .transition()
      .duration(2000)
      .style("opacity", 0.9);

    //draw flower stem
    svg.selectAll(".stem")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".stem")      
      .style("stroke", "#1E9911")
      .style("stroke-width", "1.5")
      .attr("x1", xMap)
      .attr("x2", xMap)
      .attr("y1", yMapTranslateRadius)
      .attr("y2", height)      
      .transition(t);

    svg.selectAll(".stemCountry")
      .data(data)
      .enter().append("text")
      .text(function(d) {
        return d.country;
      })
      .transition(t)
      .attr("class", ".stemCountry")
      .attr("x", xMap)
      .attr("y", yMap)
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("transform", "translate(0,80)")

    //Draw each feature petal    
    svg.selectAll(".housing")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".housing")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 0, d.housing);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 0, d.housing);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".income")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".income")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 1, d.income);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 1, d.income);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".jobs")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".jobs")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 2, d.jobs);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 2, d.jobs);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".community")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".community")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 3, d.community);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 3, d.community);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".education")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".education")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 4, d.education);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 4, d.education);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".environment")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".environment")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 5, d.environment);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 5, d.environment);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".civicengagement")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".civicengagement")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 6, d.civicengagement);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 6, d.civicengagement);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".health")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".health")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 7, d.health);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 7, d.health);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".lifesatisfaction")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".lifesatisfaction")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 8, d.lifesatisfaction);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 8, d.lifesatisfaction);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".safety")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".safety")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 9, d.safety);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 9, d.safety);
      })
      .attr("stroke-width", strokeWidth)

    svg.selectAll(".worklife")
      .data(data)
      .enter().append("line")
      .transition(t)
      .attr("class", ".worklife")
      .style("stroke", petalColor)
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 10, d.worklife);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 10, d.worklife);
      })
      .attr("stroke-width", strokeWidth)

    // draw dots above the petals 
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")            
      .attr("class", "dot")
      .attr("r", radius)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("data-legend", function(d) {
        return d.Account;
      })
      .style("fill", dotFill)
      .style("stroke", dotStroke)
      .on("mouseover", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("<div class='innerTooltip'>" + "<b>" + d.country + "</b><br/><br/>" + "Housing:" + d.housing.toFixed(2) + "<br/>" + "Income:" + d.income.toFixed(2) + "<br/>" + "Jobs:" + d.jobs.toFixed(2) + "<br/>" + "Community:" + d.community.toFixed(2) + "<br/>" + "Education:" + d.education.toFixed(2) + "<br/>" + "Environment:" + d.environment.toFixed(2) + "<br/>" + "Civic Engagement:" + d.civicengagement.toFixed(2) + "<br/>" + "Health:" + d.health.toFixed(2) + "<br/>" + "Life Satisfaction:" + d.lifesatisfaction.toFixed(2) + "<br/>" + "Safety:" + d.safety.toFixed(2) + "<br/>" + "Worklife:" + d.worklife.toFixed(2) + "<div/>")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });  
  });
}

updateData('lexico');

var lexicoSort = function() {
  updateData('lexico');
}

var avgSort = function() {
  updateData('avg');
}

var metricSort = function(param) {
  updateData(param);
}