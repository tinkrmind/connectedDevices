var csv = require("fast-csv");
var express = require('express');
const app = express();
var mongo = require('mongojs');
var config = require('./config.js');
var fs = require('fs');
// console.log(config);

var db = mongo(config.username+":"+config.userpass+"@ds131698.mlab.com:31698/floorwifimap", ["firstSweep"]);

var mapWidth = 1379;
var mapHeight = 652;

// var ssids = [ ' 00:3A:98:2C:59:A0',' 00:3A:98:2B:FD:00',' 1C:E8:5D:CA:55:32',' 1C:E8:5D:CA:07:22',' 1C:E8:5D:CA:55:35',' 1C:E8:5D:CA:55:34',' 1C:E8:5D:CA:07:25',' 00:3A:98:36:82:70',' 1C:E8:5D:CA:54:A5',' 1C:E8:5D:CA:54:A4',' 1C:E8:5D:CA:54:A2',' 1C:E8:5D:CA:E3:B5',' 1C:E8:5D:CA:49:E4',' 1C:E8:5D:CA:49:E2',' 1C:E8:5D:CA:49:E5',' 00:3A:98:2C:66:E0',' 1C:E8:5D:CA:F4:32',' 1C:E8:5D:CA:E3:B2',' 1C:E8:5D:CA:E3:B4',' 1C:E8:5D:CA:68:34',' 1C:E8:5D:CA:68:35',' 1C:E8:5D:CA:68:32',' 1C:E8:5D:CA:EB:04',' 1C:E8:5D:CA:EB:05',' 1C:E8:5D:CA:EB:02',' 1C:E8:5D:CA:F4:A5',' 1C:E8:5D:CA:F4:A4',' 1C:E8:5D:CA:F4:A2',' 1C:E8:5D:CA:F4:34',' 1C:E8:5D:CA:F4:35' ];
var ssids = [ ' 00:3A:98:2C:59:A0', ' 1C:E8:5D:CA:E5:F5', ' 1C:E8:5D:CA:E5:F4', ' 1C:E8:5D:CA:E5:F2', ' 00:3A:98:2B:FD:00', ' 1C:E8:5D:CA:DD:B4', ' 1C:E8:5D:CA:55:32', ' 1C:E8:5D:CA:DD:B2', ' 1C:E8:5D:CA:07:22', ' 1C:E8:5D:CA:55:35', ' 1C:E8:5D:CA:55:34', ' 1C:E8:5D:CA:07:25', ' 1C:E8:5D:CA:07:24', ' 1C:E8:5D:CA:F3:C5', ' 1C:E8:5D:CA:F3:C2', ' 1C:E8:5D:CA:58:02', ' 1C:E8:5D:CA:58:04', ' 1C:E8:5D:CA:57:55', ' 1C:E8:5D:CA:57:54', ' 00:3A:98:36:82:70', ' 1C:E8:5D:CA:54:A5', ' 1C:E8:5D:CA:54:A4', ' 1C:E8:5D:CA:54:A2', ' 1C:E8:5D:CA:F3:C4', ' 1C:E8:5D:CA:58:05', ' 1C:E8:5D:CA:E3:B5', ' 1C:E8:5D:CA:57:52', ' 1C:E8:5D:CA:49:E4', ' 1C:E8:5D:CA:49:E2', ' 1C:E8:5D:CA:49:E5', ' 00:3A:98:2C:66:E0', ' 1C:E8:5D:CA:F3:A4', ' 1C:E8:5D:CA:F3:A5', ' 1C:E8:5D:CA:F3:A2', ' 1C:E8:5D:CA:4B:D4', ' 1C:E8:5D:CA:F4:32', ' 1C:E8:5D:CA:C6:22', ' 1C:E8:5D:CA:E3:B2', ' 1C:E8:5D:CA:E3:B4', ' 1C:E8:5D:CA:68:34', ' 1C:E8:5D:CA:68:35', ' 1C:E8:5D:CA:EB:A2', ' 1C:E8:5D:CA:68:32', ' 1C:E8:5D:CA:4E:C5', ' 1C:E8:5D:CA:4E:C4', ' 1C:E8:5D:CA:EB:A4', ' 1C:E8:5D:CA:EB:A5', ' 1C:E8:5D:CA:EB:04', ' 1C:E8:5D:CA:EB:05', ' 1C:E8:5D:CA:EB:02', ' 1C:E8:5D:CA:BD:12', ' 1C:E8:5D:CA:BD:15', ' 1C:E8:5D:CA:BD:14', ' 1C:E8:5D:CA:F4:A5', ' 1C:E8:5D:CA:F4:A4', ' 1C:E8:5D:CA:F4:A2', ' 1C:E8:5D:CA:E2:A2', ' 1C:E8:5D:CA:F4:34', ' 1C:E8:5D:CA:E2:A4', ' 1C:E8:5D:CA:F4:35', ' 1C:E8:5D:CA:9D:54', ' 1C:E8:5D:CA:9D:52', ' 1C:E8:5D:CA:E2:A5', ' 1C:E8:5D:CA:BC:D5', ' 1C:E8:5D:CA:BC:D2', ' 1C:E8:5D:CA:BC:D4', ' 1C:E8:5D:CA:9D:55', ' 1C:E8:5D:CA:F2:F5', ' 1C:E8:5D:CA:F2:F2', ' 1C:E8:5D:CA:F2:F4', ' 38:ED:18:2C:26:D2', ' 1C:E8:5D:CA:C6:24', ' 1C:E8:5D:CA:C6:25', ' 1C:E8:5D:CA:C2:B4', ' 1C:E8:5D:CA:C2:B5' ] ;

var mappedPoint = function(x, y, rssis){
	this.x = x;
	this.y = y;
	this.rssis = rssis;
	this.pos = x+y*mapWidth;
}

var mappedPointList =[];

var rssis = []; //rssi of ssids -999 to 0
for(var i=0; i<ssids.length; i++){
	rssis.push(-999);
}

var buf = [];
var curX, curY;

var SerialPort = require('serialport');
var port = new SerialPort('COM16', {
	baudRate: 115200
});

function getRSSIs(x, y){
	curX = x;
	curY = y;
	port.write('#', function(err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		console.log('message written');
	})
}


port.on('error', function(err) {
	console.log('Error: ', err.message);
})

port.on('readable', function () {
	// console.log("poop");
	csv.fromString(String(port.read())).on("data", function(data){
		// console.log(data);		
		var index = ssids.indexOf(data[2]);
		if(index != -1){			
			rssis[index] = Number(data[1]);
		}
		if(data[0] == '#'){		
			var newPoint = new mappedPoint(curX, curY, rssis);	
			mappedPointList.push(newPoint);
			// console.log(mappedPointList);
			console.log(rssis);	
			db.firstSweep.save({"x":curX, "y":curY, "rssis":rssis}, function(err, saved) {
				if( err || !saved ) console.log("Not saved");
				else console.log("Saved");
			});
			// fs.appendFile('floorSweepData.txt', newPoint, (err) => { 
			//  // throws an error, you could also catch it here
			//  if (err) throw err;

			//  // success case, the file was saved
			//  console.log('Lyric saved!');
			// });
			rssis = [];
			for(var i=0; i<ssids.length; i++){
				rssis.push(-999);
			}
		}
	})
	.on("end", function(){
		// console.log(rssis);
		// console.log("done");
		// console.log(rssis);
	});
});

function dist(a, b){
	var dist = 0;
	for(int i=0; i< a.rssis.length; i++){
		if()		
	}
	console.log(dist);
}

app.get('/', function(req, res){
	res.send('x:'+req.query.x+' y:'+req.query.y);
	res.end;
	console.log(req.query.x, req.query.y);
	getRSSIs(req.query.x, req.query.y);
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))



// var networkList = [ 
// { mac: " 00:3A:98:2C:59:A0", ssid: "itpsandbox",maxRSSI: -41,minRSSI: -87 },
// { mac: " 00:3A:98:2B:FD:00", ssid: "itpsandbox",maxRSSI: -47,minRSSI: -88 },
// { mac: " 1C:E8:5D:CA:55:32", ssid: "nyu-legacy",maxRSSI: -47,minRSSI: -80 },
// { mac: " 1C:E8:5D:CA:07:22", ssid: "nyu-legacy",maxRSSI: -55,minRSSI: -86 },
// { mac: " 1C:E8:5D:CA:55:35", ssid: "nyuguest-legacy", maxRSSI: -46,minRSSI: -82 },
// { mac: " 1C:E8:5D:CA:55:34", ssid: "eduroam", maxRSSI: -46,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:07:25", ssid: "nyuguest-legacy", maxRSSI: -55,minRSSI: -85 },
// { mac: " 00:3A:98:36:82:70", ssid: "itpsandbox",maxRSSI: -45,minRSSI: -90 },
// { mac: " 1C:E8:5D:CA:54:A5", ssid: "nyuguest-legacy", maxRSSI: -52,minRSSI: -84 },
// { mac: " 1C:E8:5D:CA:54:A4", ssid: "eduroam", maxRSSI: -51,minRSSI: -80 },
// { mac: " 1C:E8:5D:CA:54:A2", ssid: "nyu-legacy",maxRSSI: -51,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:E3:B5", ssid: "nyuguest-legacy", maxRSSI: -47,minRSSI: -90 },
// { mac: " 1C:E8:5D:CA:49:E4", ssid: "eduroam", maxRSSI: -52,minRSSI: -87 },
// { mac: " 1C:E8:5D:CA:49:E2", ssid: "nyu-legacy",maxRSSI: -53,minRSSI: -88 },
// { mac: " 1C:E8:5D:CA:49:E5", ssid: "nyuguest-legacy", maxRSSI: -55,minRSSI: -87 },
// { mac: " 00:3A:98:2C:66:E0", ssid: "itpsandbox",maxRSSI: -42,minRSSI: -90 },
// { mac: " 1C:E8:5D:CA:F4:32", ssid: "nyu-legacy",maxRSSI: -47,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:E3:B2", ssid: "nyu-legacy",maxRSSI: -49,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:E3:B4", ssid: "eduroam", maxRSSI: -45,minRSSI: -86 },
// { mac: " 1C:E8:5D:CA:68:34", ssid: "eduroam", maxRSSI: -53,minRSSI: -78 },
// { mac: " 1C:E8:5D:CA:68:35", ssid: "nyuguest-legacy", maxRSSI: -51,minRSSI: -81 },
// { mac: " 1C:E8:5D:CA:68:32", ssid: "nyu-legacy",maxRSSI: -53,minRSSI: -63 },
// { mac: " 1C:E8:5D:CA:EB:04", ssid: "eduroam", maxRSSI: -44,minRSSI: -85 },
// { mac: " 1C:E8:5D:CA:EB:05", ssid: "nyuguest-legacy", maxRSSI: -46,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:EB:02", ssid: "nyu-legacy",maxRSSI: -46,minRSSI: -84 },
// { mac: " 1C:E8:5D:CA:F4:A5", ssid: "nyuguest-legacy", maxRSSI: -50,minRSSI: -82 },
// { mac: " 1C:E8:5D:CA:F4:A4", ssid: "eduroam", maxRSSI: -54,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:F4:A2", ssid: "nyu-legacy",maxRSSI: -50,minRSSI: -83 },
// { mac: " 1C:E8:5D:CA:F4:34", ssid: "eduroam", maxRSSI: -49,minRSSI: -81 },
// { mac: " 1C:E8:5D:CA:F4:35", ssid: "nyuguest-legacy", maxRSSI: -49,minRSSI: -81 } ]; 
