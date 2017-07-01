var currentPageIndex = 0;
var pageNodes = [];
var maxPages = 0;

var decreasePage = function decreasePage(e) {
	e.preventDefault();
	if(currentPageIndex > 0)
		currentPageIndex--;

	pagination(usersAVGErrors);
}

var increasePage = function increasePage(e) {
	e.preventDefault();
	if(currentPageIndex < maxPages)
		currentPageIndex++;

	pagination(usersAVGErrors);
}

function buildPageIndex(maxPages) {
	var div = document.getElementById('pageIndex');
	clearChildren(div);
	var i;
	for(i = 0;i < maxPages; i++) {		
		var e = buildAnchorIndex(i+1);
		div.appendChild(e);
	}
}

function buildAnchorIndex(i) {
	var anchor = document.createElement('a');
	anchor.innerHTML = i;
	anchor.className = "floating btn";
	anchor.href = "#";
	anchor.addEventListener('click', function(e)
	{
		e.preventDefault();
		currentPageIndex = parseInt(this.innerHTML) - 1;
		pagination();
	});
	return anchor;
}


var pagination = function (collection) {
	var pages = collection;
	pageNodes = [];

	var itensPerPage = document.getElementById('usersByPage').value;

	maxPages = Math.ceil(pages.length / itensPerPage);
	// buildPageIndex(maxPages);	

	var startIndex = currentPageIndex * itensPerPage;
	var finalIndex = (currentPageIndex + 1) * itensPerPage;

	finalIndex = finalIndex > pages.length? pages.length : finalIndex;

	// Slice does not include last position
	var currentPage = pages.slice(startIndex, finalIndex);
	var i = 0;

	currentPage.forEach(function(e){
		pageNodes[i] = e;
		i++;
	});

	drawParallel(pageNodes);
}