var svg1 = d3.select("#question1")
  .append("svg")
  .attr("id", "vis1");

var svg2 = d3.select("#question2")
  .append("svg")
  .attr("id", "vis2");

var svg3 = d3.select("#question3")
  .append("svg")
  .attr("id", "vis3");  

d3.selectAll("svg")
  .append("g");

svg1.append("text")
  .text("SVG 1")
  .attr("x", 300)
  .attr("y", 30)
  .attr("font-family", "sans-serif")
  .attr("font-size", "22px")
  .attr("fill", "black");

svg2.append("text")
  .text("SVG 2")
  .attr("x", 300)
  .attr("y", 30)
  .attr("font-family", "sans-serif")
  .attr("font-size", "22px")
  .attr("fill", "black");

svg3.append("text")
  .text("SVG 3")
  .attr("x", 300)
  .attr("y", 30)
  .attr("font-family", "sans-serif")
  .attr("font-size", "22px")
  .attr("fill", "black");