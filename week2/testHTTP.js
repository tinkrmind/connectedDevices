var request = require('request');
var sleep = require('sleep');
const path = require('path')
const getColors = require('get-image-colors')
var palette = [
[60541, 47, 37], 
[6103, 80, 78], 
[51222, 125, 11], 
[24029, 63, 64], 
[47330, 57, 63]
];

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
						'sat':palette[i][1], 'bri':palette[i][2], 'transitiontime':15})
	};
	request(options, callback);
	// request.end();	
}

function callback(err, res, body){
	console.log('error:', err); // Print the error if one occurred
  	console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
  	console.log('body:', body); // Print the HTML for the Google homepage.  	
}