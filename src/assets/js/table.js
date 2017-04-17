
// This function expects a list of column names and it will return the string for the HTML table header
function createTableHeaderHTML(headers){

	var line = "<tr>";
	headers.forEach(function(header){
		line += "<th>" + header + "<href><i class=\"fa fa-fw fa-sort\" id=\""+header+"\"></i> </th></href>";
	});
	line = line  + "</tr>";
	console.log(line);
	return line;
}


// This function expects a map for a single row and it will return the string for the HTML table row
function createTableLineHTML(row){

	var line = "<tr>";
	Object.keys(row).forEach(function(key){
		line = line + "<td>" + row[key] + "</td>";
	});
	line = line+"</tr>";
	console.log(line);
	return line;
}

// This function expects the input data and the id of the element that the table will be written on
function writeTable(data,id){		
	var table = "<table class= \"table\">";
	table+= createTableHeaderHTML(Object.keys(data[0]));	
	data.forEach(function(row){
		table+= createTableLineHTML(row);
	});
	table +="</table>";
	$("#"+id).html(table); 
}

$( document ).ready(function() {
	$("#wrapper").toggleClass("toggled");
	$(".previous").hide();


	// Loads data from csv and writes generated table to tableWrapper
	d3.csv("/data/cities.csv", function(data) {
		writeTable(data,"tableWrapper");
	});
	

	// Sorting functionality
	$('body').on('click', 'i.fa-sort', function(event) {    
		// TODO sort by column
		console.log("sorting by column "+event.target.id)
	});

	// Pagination functionality
	$('.next').click(function(){
		// TODO paginacao
		console.log("next");
	});
	
	$('.previous').click(function(){
		// TODO paginacao
		console.log("previous");
	});

	// Search functionality
	$('.searchField').on('input',function(){
		//TODO filtro do search
		console.log("searching");
	});

}); 


