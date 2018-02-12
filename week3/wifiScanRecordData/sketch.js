var img; 
var mapWidth = 1379;
var mapHeight = 652;


var mappedPoints = function(x, y){
	this.x = x;
	this.y = y;
}
var points = [];

function setup() {
	createCanvas(mapWidth, mapHeight);
	img = loadImage("https://i.imgur.com/QB6YbM7.png");
	console.log("Asdohsfijsdoifhsdiufhdoijsfhf");
	fill('cyan');
}

function draw() {
	image(img, 0, 0);
	for(var i=0; i<points.length; i++){		
		ellipse(points[i].x, points[i].y, 15, 15);
	}	
}

function mouseReleased(){
	var x = mouseX;
	var y = mouseY;
	points.push(new mappedPoints(x, y));
	console.log("ppp");
	getRSSI(x, y);
}

function getRSSI(x, y){
	url = 'http://127.0.0.1:8080/?x='+x+'&y='+y;

	requestProcessed = false;
	httpGet(url, function(response) {
    	result = response;
    	requestProcessed = true;
    	console.log(result);
  	});
  	// while(requestProcessed == false);

}
