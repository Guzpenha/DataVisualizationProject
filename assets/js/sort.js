var sortDataByMetric = function(data, parameter) {  
  data.sort(function(a, b) {    
    return a[parameter] - b[parameter];
  });
}

var sortDataByAvg = function(data) {
  data.sort(function(a,b) {
    return countryAverage(a) - countryAverage(b);
  })
}

var sortDataByName = function(data) {  
  data.sort(function(a,b) {
    return getEntry(countryDictionary, a.country).localeCompare(getEntry(countryDictionary, b.country)); 
  });  
}