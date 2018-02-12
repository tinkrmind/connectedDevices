const path = require('path')
const getColors = require('get-image-colors')
 
getColors('./amitabh.jpg').then(colors => {
	colors = colors.map(colors => colors.hsl())
	// `colors` is an array of color objects 
	for(i=0; i<colors.length; i++){
	  console.log(colors[i][0]*65535/360);
	  console.log(colors[i][1]);
	  console.log(colors[i][2]);
	  console.log();
	}
})
