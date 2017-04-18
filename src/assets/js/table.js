var rowsPerPage = 3;

// This function expects a list of column names and it will return the string for the HTML table header
function createTableHeaderHTML(headers){

	var line = "<tr>";
	headers.forEach(function(header){
		line += "<th>" + header + "<href><i class=\"glyphicon glyphicon-triangle-top\" id=\""+header+"\"> </i> </th></href>";
	});
	line = line  + "</tr>";	
	return line;
}


// This function expects a map for a single row and it will return the string for the HTML table row
function createTableLineHTML(row){

	var line = "<tr>";
	Object.keys(row).forEach(function(key){
		line = line + "<td>" + row[key] + "</td>";
	});
	line = line+"</tr>";	
	return line;
}

// This function expects the input data and the id of the element that the table will be written on
function writeTable(data,id, index){	
	index = index | 0 ;	
	var end = rowsPerPage;
	var begin = index*rowsPerPage;	
	if(begin>0){		
		end = (begin+rowsPerPage)
	}

	// Current index 
	data = (data.slice(begin,end));

	var table = "<table class= \"table\">";
	table+= createTableHeaderHTML(Object.keys(data[0]));
	data.forEach(function(row){				
		table+= createTableLineHTML(row);
	});
	table +="</table>";
	$("#"+id).html(table); 
}



// Generic object sort modified from http://stackoverflow.com/questions/2466356/javascript-object-list-sorting-by-object-property
var byProperty = function(prop,reverse) {
	reverse = reverse || true; // reversed by default 
    var reversed = (reverse) ? -1 : 1;

    return function(a,b) {
        if (typeof a[prop] == "number") {
            return (a[prop] - b[prop]) * reversed;
        } else {
            return ((a[prop] < b[prop]) ? (-1*reversed) : ((a[prop] > b[prop]) ? (1*reversed) : 0));
        }
    };
};

$( document ).ready(function() {
	$("#wrapper").toggleClass("toggled");
	$(".previous").hide();
	
	// Loads data from csv and writes generated table to tableWrapper
	var globalData = []
	var filteredData =[]

	d3.csv("/data/cities.csv", function(data) {
		floatRows = ["land area","population"]
		data.forEach(function(row){
			floatRows.forEach(function(col){
				row[col] = parseFloat(row[col]);
			});
			globalData.push(row);
		});				
		writeTable(data,"tableWrapper");				
		globalData = data		
	});	

	// Sorting functionality
	$('body').on('click', 'i.glyphicon-triangle-top', function(event) {    		
		var target = $( event.target );
		var colName = event.target.id;
		if($('.searchField').val()!==""){
			data = filteredData;
		}else{
			data = globalData;
		}
		data = data.sort(byProperty(colName))
		writeTable(data,"tableWrapper");
		$(".previous").hide();
		$(".previous").attr("id",0);
		$(".next").attr("id",2);
	});

	// Pagination functionality
	$('.next').click(function(event){
		var paginationData = globalData;
		if($('.searchField').val()!==""){
			paginationData = filteredData;
		}
		var pageNumber = event.target.id
		$("#pageNumber").html("Page "+pageNumber)
		writeTable(paginationData,"tableWrapper",parseFloat(pageNumber));		
		if(pageNumber*rowsPerPage + rowsPerPage>= Object.keys(paginationData).length){
			$(".next").hide();			
		}
		$(".previous>a").attr("id",parseFloat(pageNumber)-1)
		$(".next>a").attr("id",parseFloat(pageNumber)+1)
		$(".previous").show();
	});
	
	$('.previous').click(function(event){
		var paginationData = globalData;
		if($('.searchField').val()!==""){
			paginationData = filteredData;
		}
		$(".next").show();
		var pageNumber = event.target.id
		$("#pageNumber").html("Page "+pageNumber)
		writeTable(paginationData,"tableWrapper",parseFloat(pageNumber));		
		$(".next>a").attr("id",parseFloat(pageNumber)+1)
		var diff = parseFloat(pageNumber)-1
		if(diff<0){diff=0}
		$(".previous>a").attr("id",diff)		
		if(pageNumber==="0"){			
			$(".previous").hide();
		}
	});

	// Search functionality
	$('.searchField').on('input',function(event){		
		var target = $( event.target );
		var searchInput = target.val()
	
		filteredData =[];
		globalData.forEach(function(row){
			vals = Object.keys(row).map(key => row[key]);
			if(vals.join(" ").includes(searchInput)){
				filteredData.push(row);
			}
		});			
		writeTable(filteredData,"tableWrapper");
		$(".previous").hide();
		$(".previous").attr("id",0);
		$(".next").attr("id",2);
		if(Object.keys(filteredData).length<= rowsPerPage){
			$(".next").hide();
		}else{
			$(".next").show();
		}
	});

}); 


