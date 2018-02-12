const path = require('path')
const getColors = require('get-image-colors')
var palette = [];

imagePath = './uploads/Amitabh_pan_card_back.jpg';

getColors(imagePath, function (err, colors) {
	colors = colors.map(colors => colors.hsl());
		// `colors` is an array of color objects 
		printColors(colors);
	});

function printColors(colors){
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
