
// The number of rows per page (this could be extracted from a dropdown input)
var rowsPerPage = 15;


function createTableHeaderHTML(headers){
	/* 

	This function creates html for the table header

	Inputs
	-------
		headers: a list of column names

	Return
	-------
		string for the HTML table header   */

	var line = "<tr>";
	headers.forEach(function(header){
		line += "<th>" + header + "<href><i class=\"glyphicon glyphicon-triangle-top\" id=\""+header+"\"> </i> </th></href>";
	});
	line = line  + "</tr>";	
	return line;
}

function createTableLineHTML(row){
	/* 

	This function creates html for a table row

	Inputs
	-------
		row: an object with key and values

	Return
	-------
		string for the HTML table row   */

	var line = "<tr>";
	Object.keys(row).forEach(function(key){
		line = line + "<td>" + row[key] + "</td>";
	});
	line = line+"</tr>";	
	return line;
}


function writeTable(data, id, index){	
	/* 

	This function assembles the HTML for the dynamic table and writes it inside id

	Inputs
	-------
		data: object containing data to be displayed in a table 
		id: the html tag it for writing the table inside
		index: the page index of the table (pagination)	  */

	// Finds data indexes regarding the page (index)
	index = index | 0 ;	
	var end = rowsPerPage;
	var begin = index*rowsPerPage;	
	if(begin>0){		
		end = (begin+rowsPerPage)
	}

	// Current index 
	data = (data.slice(begin,end));

	// Creates HTML 
	var table = "<table class= \"table\">";
	table+= createTableHeaderHTML(Object.keys(data[0]));
	data.forEach(function(row){				
		table+= createTableLineHTML(row);
	});
	table +="</table>";

	// writes it to id tag
	$("#"+id).html(table); 
}




var byProperty = function(prop,reverse) {
	/*	Generic object sort modified from
	 http://stackoverflow.com/questions/2466356/javascript-object-list-sorting-by-object-property */

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


/*  Loads table from  file "/data/dados-tp1.csv" and set trigers for dynamic functions */
$( document ).ready(function() {
	$("#wrapper").toggleClass("toggled");
	$(".previous").hide();
		
	// Loads data from csv and writes generated table to tableWrapper //
	var globalData = []
	var filteredData =[]
	d3.csv("/data/dados-tp1.csv", function(data) {
		floatRows = ["numEmps","raisedAmt"]
		data.forEach(function(row){
			floatRows.forEach(function(col){
				row[col] = row[col] || 0
				row[col] = parseFloat(row[col]);
			});
			globalData.push(row);
		});				
		writeTable(data,"tableWrapper");				
		globalData = data		
	});	

	//-------------------------//
	// Sorting functionality   //
	//-------------------------//
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

	//-------------------------//
	// Pagination functionality//
	//-------------------------//
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
	//-------------------------//
	// Search functionality	   //
	//-------------------------//
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


