var request = require('request');
var express = require('express');
var multer = require('multer'),
bodyParser = require('body-parser'),
path = require('path');
var cons = require('consolidate');
const getColors = require('get-image-colors')
var palette = [
[60541, 47, 37], 
[6103, 80, 78], 
[51222, 125, 11], 
[24029, 63, 64], 
[47330, 57, 63]
];


var app = new express();
app.use(bodyParser.json());

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', function(req, res){
	res.render('index');
});

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

getColors('./uploads/amitabh.jpg', function (err, colors) {
	colors = colors.map(colors => colors.hsl());
		// `colors` is an array of color objects 
		printColors(colors);
	});

function printColors(colors){
	palette = [];
	for(i=0; i<colors.length; i++){
		var hue = parseInt(colors[i][0]*65535/360);
		var sat = parseInt(colors[i][1]*255);
		var bri = parseInt(colors[i][2]*100);
		palette.push([hue, sat, bri]);
		console.log(palette[i][0]);
		console.log(palette[i][1]);
		console.log(palette[i][2]);
		console.log();
	}
}

app.post('/', multer({ storage:storage}).single('upl'), function(req,res){
	console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	*/
	console.log(req.file); //form files
	/* example output:
    { fieldname: 'upl',
      originalname: 'grumpy.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './uploads/',
      filename: '436ec561793aa4dc475a88e84776b1b9',
      path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
      size: 277056 }
      */

      var imagePath = './'+req.file.path;
      console.log(imagePath)
      getColors(imagePath, function (err, colors) {
      	colors = colors.map(colors => colors.hsl());
		// `colors` is an array of color objects 
		printColors(colors);
	});

      res.status(204).end();
  });			


var count = 0;

setInterval(changeColor, 5000);

function changeColor(){
	count++;
	// console.log("poop");
	i = count%palette.length;

	var options = {
		method:'PUT',
		url: 'http://172.22.151.148/api/o7YhSFvxUuk-GMFtswL7BRPremAR6pPoAd7L0TRh/lights/32/state',
		body: JSON.stringify({'on':true,'hue': palette[i][0], 
						'sat':palette[i][1], 'bri':palette[i][2], 'transitiontime':25})
	};
	request(options, callback);
	// request.end();	
}

function callback(err, res, body){
	console.log('error:', err); // Print the error if one occurred
  	console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
  	console.log('body:', body); // Print the HTML for the Google homepage.  	
}

var port = 8080;
app.listen( port, function(){ console.log('listening on port '+port); } );