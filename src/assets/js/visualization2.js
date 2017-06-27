/**
 * visualization_2.js
 *
 * This script renders the scatter plots which shows how the average error varies
 * for each prediction method depending on the values of features.
 */

function generate_filter(method) {
    return function(el) {
        return el["RS"] == method;
    };
};

function leastSquares(data, featureName) {
    var mean = {
        "x": 0,
        "y": 0
    };

    var variance = {
        "x": 0,
        "y": 0
    }

    var cov = 0;

    for (i = 0; i < data.length; i++) {
        mean.x += parseFloat(data[i][featureName]);
        mean.y += parseFloat(data[i]["avg_error"]);
    }

    mean.x /= data.length;
    mean.y /= data.length;

    for (i = 0; i < data.length; i++) {
        variance.x += Math.pow(parseFloat(data[i][featureName]) - mean.x, 2);
        variance.y += Math.pow(parseFloat(data[i]["avg_error"]) - mean.y, 2);

        cov += (parseFloat(data[i][featureName]) - mean.x) * 
               (parseFloat(data[i]["avg_error"]) - mean.y);
    }

    variance.x /= data.length;
    variance.y /= data.length;

    cov /= data.length;

    var b = cov / variance.x,
        a = mean.y - b * mean.x;

    var pearsonCoef = cov / Math.pow(variance.x * variance.y, 0.5);

    return [a, b, pearsonCoef];

};

function plot_single(data, rowNode, featureName, methodName, size, margin) {
    var x = d3.scaleLinear().range([margin.x, size.x + margin.x]);
    var y = d3.scaleLinear().range([size.y, margin.y]);

    // Compute trend line intercept and slope
    var trendData = leastSquares(data, featureName);

    x.domain(d3.extent(data, function(d) { return d[featureName]; }));
    y.domain([0, 5]);

    var node = rowNode.append("td")
      .style("padding", "0px").append("svg");

    var xExtent = d3.extent(data, function(d) { return d[featureName]; });

    node.append("g")
      .append("line")
      .attr("stroke", "blue")
      .attr("stroke-width", "3px")
      .attr("x1", x(xExtent[0]))
      .attr("y1", y(trendData[0] + trendData[1] * xExtent[0]))
      .attr("x2", x(xExtent[1]))
      .attr("y2", y(trendData[0] + trendData[1] * xExtent[1]));

    node.style("width", size.x + margin.x)
      .style("height", size.y +  margin.y)
      .style("display", "inline")
      .selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("class", function(d) { return "user" + d["userId"]; })
      .attr("r", 3)
      .style("fill-opacity", .3)
      .attr("cx", function(d) { return x(parseFloat(d[featureName])); })
      .attr("cy", function(d) { return y(parseFloat(d["avg_error"])); });

    node.append("g")
      .attr("transform", "translate(0," + size.y + ")")
      .style("font-size", "9px")
      .call(d3.axisBottom(x).tickValues(
        d3.range(xExtent[0], xExtent[1], (xExtent[1] - xExtent[0])/5)
      ));

    node.append("g")
      .attr("transform", "translate(" + margin.x + ", 0)")
      .style("font-size", "9px")
      .call(d3.axisLeft(y).tickValues(d3.range(0, 6)));

    // We return the Pearson's correlation value
    return trendData[2];
}


function plotVisualization2() {
    var margin = { x: 30, y: 20 },
        size   = { x: 97, y: 97 };

    var sparkHeight = 26;

    $("#question2").empty();
    var table = d3.select("#question2")
      .append("div")
      .append("table");

    // Read user data
    d3.csv("../data/user_features_with_errors_sample.csv", function(error, data) {
        if (error) {
            console.error(error);
            throw error;
        }

        var features = ["fwls_feature_4", "fwls_feature_6", "fwls_feature16",
                        "fwls_feature24"];
        var methods = ["BiasedMatrixFactorization", "FactorWiseMatrixFactorization",
                       "BiPolarSlopeOne", "MatrixFactorization",
                       "CoClustering", "LatentFeatureLogLinearModel",
                       "SigmoidSVDPlusPlus", "UserAverage"];

        var splitData = [];
        for (var i = 0; i < methods.length; i++) {
            splitData.push(data.filter(generate_filter(methods[i])));
        }

        for (var i = 0; i < features.length; i++) {
            var sparkRow = table.append("tr");

            var titleRow = table.append("tr");
            titleRow.append("td");
            for (var j = 0; j < methods.length; j++) {
                titleRow.append("td")
                  .style("text-align", "center")
                  .style("font-size", "9px")
                  .text(methods[j]);
            }

            var row = table.append("tr");

            // First row cell (label)
            row.append("td")
               .append("div")
               .style("transform", "rotate(-90deg)")
               .style("width", "15px")
               .style("padding-right", margin.x + "px")
               .text("avg_error");


            var corr = [];
            for (var j = 0; j < methods.length; j++) {
                var thisCorr = plot_single(splitData[j], row, features[i], methods[j], size, margin);
                corr.push({
                    "index": j,
                    "prevCorr": j == 0 ? 0 : corr[j - 1]["corr"],
                    "corr": thisCorr
                });
            }

            // Create spark line above charts
            var cellWidth = size.x + margin.x;
            sparkRow.append("td");

            var y = d3.scaleLinear().range([3, sparkHeight - 3]);
            y.domain(d3.extent(corr, function(d) { return d["corr"]; }));

            var cell = sparkRow.append("td")
              .attr("colspan", methods.length)
              .append("svg")
              .attr("width", "100%")
              .attr("height", sparkHeight);

            cell.selectAll("corrLines1")
              .data(corr)
              .enter().append("line")
              .attr("stroke-width", "2px")
              .attr("stroke", "black")
              .attr("x1", function(d) { return d["index"] * cellWidth - cellWidth / 2; })
              .attr("y1", function(d) { return d["prevCorr"] == 0 ? sparkHeight / 2 : y(d["prevCorr"]); })
              .attr("x2", function(d) { return (d["index"] * cellWidth) + (cellWidth / 2); })
              .attr("y2", function(d) { return y(d["corr"]); });

            cell.selectAll("corrLines2")
              .data(corr)
              .enter().append("line")
              .attr("stroke-width", "2px")
              .attr("stroke", "black")
              .attr("x1", function(d) { return (d["index"] * cellWidth) + (cellWidth / 2); })
              .attr("y1", function(d) { return y(d["corr"]); })
              .attr("x2", function(d) { return (d["index"] * cellWidth) + 3 * cellWidth / 2; })
              .attr("y2", function(d) {
                return d["index"] < corr.length - 1 ? y(corr[d["index"] + 1]["corr"]) : sparkHeight / 2;
              });

            table.append("tr")
              .append("td")
              .attr("colspan", methods.length + 1)
              .style("padding-bottom", "20px")
              .append("center")
              .text(features[i]);
        }

        $("#question2 svg circle").mouseenter(function(e) {
            var userId = $(e.target).prop("className").baseVal;

            $("#question2 ." + userId)
              .css("fill-opacity", 1)
              .attr("fill", "red")
              .attr("stroke", "black")
              .attr("r", 5);

        });

        $("#question2 svg circle").mouseleave(function(e) {
            var userId = $(e.target).prop("className").baseVal;

            $("#question2 ." + userId)
              .css("fill-opacity", .3)
              .attr("fill", "black")
              .attr("stroke", "none")
              .attr("r", 3);

        });
    });
}
