var csv = require("fast-csv");

var aps = [];
var ssids = [];

var network = function(mac, ssid, max, min){
	this.mac = mac;
	this.ssid = ssid;
	this.maxRSSI = max;
	this.minRSSI = min;
};

network.prototype.updateMax = function(max){
	this.max = max;
}

network.prototype.updateMin = function(min){
	this.min = min;
}

var networkList = [];
var recognisedAPs = ["nyu-legacy", "nyuguest-legacy", "eduroam", "itpsandbox"];

csv.fromPath("aps.csv").on("data", function(data){
	// console.log(data[3]);
	if(recognisedAPs.indexOf(String(data[3]).trim()) != -1){
		if(ssids.indexOf(data[2]) == -1){
			ssids.push(data[2]);
			networkList.push(new network(data[2], data[3], Number(data[1]), Number(data[1])));
		} else{
			index = ssids.indexOf(data[2]);
			if(Number(data[1]) < networkList[index].minRSSI){
				networkList[index].minRSSI = Number(data[1]);
			}
			if(Number(data[1]) > networkList[index].maxRSSI){
				networkList[index].maxRSSI = Number(data[1]);
			}
		} 
	}
	// console.log(aps)
})
.on("end", function(){
	console.log("done");
	// console.log(networkList);
	// console.log(ssids.length);
	for(var i=0; i<ssids.length; i++){
		if(networkList[i].maxRSSI == networkList[i].minRSSI){
			networkList.splice(i, 1);
			ssids.splice(i, 1);
			i--;
		}
	}
	for(var i=0; i<ssids.length; i++){
		if(networkList[i].maxRSSI < -70){
			networkList.splice(i, 1);
			ssids.splice(i, 1);
			i--;
		}
	}
	console.log(networkList);
	console.log(ssids);
	console.log(ssids.length);
	// console.log(aps);
});

