//Util lib to help on some function

//Clear children from element specified
function clearChildren(element) {
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }	
}