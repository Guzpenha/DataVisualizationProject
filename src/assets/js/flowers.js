var currentData;

var numberOfTicks = 20;

var margin = {
    top: 0,
    right: 20,
    bottom: 0,
    left: 20
  },
  width = innerWidth;
height = 600 - margin.top - margin.bottom;

var radius = 4; //circle radius for flower button

var countryAverage = function(d) {
  var sum = d.housing 
  + d.income 
  + d.jobs 
  + d.community 
  + d.education 
  + d.environment 
  + d.civicengagement
  + d.health
  + d.lifesatisfaction
  + d.safety
  + d.worklife;
  return sum / 11;
};

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

// setup fill color
var cValue = function(d) {
    return d;
  },
  color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("body")
  .append("svg")
  .attr('class', 'flowers-chart')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip extra
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0.0);


var svgDefs = svg.append('defs');
var padding = 15;

var mainGradient = svgDefs.append('linearGradient')
  .attr('id', 'mainGradient');

mainGradient.append('stop')
  .attr('class', 'stop-left')
  .attr('offset', '0');

mainGradient.append('stop')
  .attr('class', 'stop-right')
  .attr('offset', '1');

svg.append('rect')
  .classed('filled', true)
  .attr('x', padding)
  .attr('y', padding)
  .attr("transform", "translate(" + (-margin.left - 20) + "," + (-margin.top - 20) + ")");

var dataScale = 10;

// TOOO: Change to insert and update pattern ( V3 )
var updateData = function() {
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

    var theta = Math.PI * 2 / 11;

    // xScale.domain([d3.min(data, xAxis)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    var x = d3.scalePoint()
      .domain(data.map(function(a) {
        return a.country;
      }))
      .range([0, width]);
      // .rangeRoundBands([0, width], 0.05);

    var xAxis = d3.axisBottom()
                .scale(x);      

    var factor = (width / data.length);
    var petalFactor = 2;

    var xMap = function(d) {
      return data.indexOf(d) * factor
    };

    var xPetalMap = function(d, attrNumber, attribute) {
      return xMap(d) + attribute * petalFactor * Math.cos(theta * attrNumber);
    };
    var yPetalMap = function(d, attrNumber, attribute) {
      return yMap(d) - attribute * petalFactor * Math.sin(theta * attrNumber);
    };


    // Optional
    // var bezierLine = d3.svg.line()
    //     .x(function(d) { return d[0]; })
    //     .y(function(d) { return d[1]; })
    //     .interpolate("basis");

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
      .attr("fill", "white")
      .attr("opacity", 0.1)
      .transition()
      .duration(2000)
      .style("opacity", 0.9);

    //draw flower stem
    svg.selectAll(".stem")
      .data(data)
      .enter().append("line")
      .attr("class", ".stem")
      .style("stroke", "#88DC76")
      .style("stroke-width", "1.5")
      .attr("x1", xMap)
      .attr("x2", xMap)
      .attr("y1", yMapTranslateRadius)
      .attr("y2", height);

    svg.selectAll(".stemCountry")
      .data(data)
      .enter().append("text")
      .text(function(d) {
        return d.country;
      })
      .attr("class", ".stemCountry")
      .attr("x", xMap)
      .attr("y", yMap)
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("transform", "translate(0,80)");



    // Another option: Bezier Curve for petals
    // svg.selectAll(".housing")
    //   .data(data)
    //   .enter().append("path")
    //      .attr("d", function(d) { 
    //                   var finalX = xPetalMap(d, 0, d.housing);
    //                   var finalY = yPetalMap(d, 0, d.housing);                    
    //                   return bezierLine([[xMap(d), yMap(d)], [finalX, finalY], [xMap(d) + 15, yMap(d) - 15]]);
    //                 })
    //      .attr("class", ".housing")
    //      .style("stroke", "white")       
    //      .style("fill", "white")

    //Draw each feature petal    
    svg.selectAll(".housing")
      .data(data)
      .enter().append("line")
      .attr("class", ".housing")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 0, d.housing);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 0, d.housing);
      })


    svg.selectAll(".income")
      .data(data)
      .enter().append("line")
      .attr("class", ".income")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 1, d.income);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 1, d.income);
      })

    svg.selectAll(".jobs")
      .data(data)
      .enter().append("line")
      .attr("class", ".jobs")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 2, d.jobs);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 2, d.jobs);
      })

    svg.selectAll(".community")
      .data(data)
      .enter().append("line")
      .attr("class", ".community")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 3, d.community);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 3, d.community);
      })

    svg.selectAll(".education")
      .data(data)
      .enter().append("line")
      .attr("class", ".education")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 4, d.education);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 4, d.education);
      })

    svg.selectAll(".environment")
      .data(data)
      .enter().append("line")
      .attr("class", ".environment")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 5, d.environment);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 5, d.environment);
      })

    svg.selectAll(".civicengagement")
      .data(data)
      .enter().append("line")
      .attr("class", ".civicengagement")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 6, d.civicengagement);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 6, d.civicengagement);
      })

    svg.selectAll(".health")
      .data(data)
      .enter().append("line")
      .attr("class", ".health")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 7, d.health);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 7, d.health);
      })

    svg.selectAll(".lifesatisfaction")
      .data(data)
      .enter().append("line")
      .attr("class", ".lifesatisfaction")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 8, d.lifesatisfaction);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 8, d.lifesatisfaction);
      })

    svg.selectAll(".safety")
      .data(data)
      .enter().append("line")
      .attr("class", ".safety")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 9, d.safety);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 9, d.safety);
      })

    svg.selectAll(".worklife")
      .data(data)
      .enter().append("line")
      .attr("class", ".worklife")
      .style("stroke", "white")
      .attr("x1", xMap)
      .attr("x2", function(d) {
        return xPetalMap(d, 10, d.worklife);
      })
      .attr("y1", yMap)
      .attr("y2", function(d) {
        return yPetalMap(d, 10, d.worklife);
      })

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
      .style("fill", "#FFFFFF")
      .style("stroke", "#FFFFFF")
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
updateData();