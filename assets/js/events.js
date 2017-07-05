// Attach the Events for User Interface

document.getElementById('lexicoSort').addEventListener("click", function(e) {
	lexicoSort();
});

document.getElementById('avgSort').addEventListener("click", function(e) {
	avgSort();
});

document.getElementById('housingSort').addEventListener("click", function(e) {
	metricSort('housing');
});

document.getElementById('incomeSort').addEventListener("click", function(e) {
	metricSort('income');
});

document.getElementById('jobsSort').addEventListener("click", function(e) {
	metricSort('jobs');
});

document.getElementById('communitySort').addEventListener("click", function(e) {
	metricSort('community');
});

document.getElementById('educationSort').addEventListener("click", function(e) {
	metricSort('education');
});

document.getElementById('environmentSort').addEventListener("click", function(e) {
	metricSort('environment');
});

document.getElementById('civicSort').addEventListener("click", function(e) {
	metricSort('civicengagement');
});

document.getElementById('healthSort').addEventListener("click", function(e) {
	metricSort('health');
});

document.getElementById('lifeSort').addEventListener("click", function(e) {
	metricSort('lifesatisfaction');
});

document.getElementById('safetySort').addEventListener("click", function(e) {
	metricSort('safety');
});

document.getElementById('workSort').addEventListener("click", function(e) {
	metricSort('work');
});

console.log("UI Ready.");