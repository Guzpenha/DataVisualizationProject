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