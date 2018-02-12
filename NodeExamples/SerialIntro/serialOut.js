/*
serialOut.js

Tests the functtionality of the serial port library.
To be used in conjunction with the Arduino sketch called AsciiSerialRead.ino

This script sends a number out the serial port
every second.

To call this from the command line:

node serialOut.js portname

where portname is the path to the serial port.

refactored to get rid of anonymous functions, to make it clearer for
those new to JavaScript

created 17 June 2014
modified 26 Sept 2017
by Tom Igoe
*/

// serial port initialization:
var SerialPort = require('serialport');			// include the serialport library
var	portName =  process.argv[2];						// get the port name from the command line
const myPort = new SerialPort(portName);		// open the port
const parser = new Readline();							// make a new parser to read ASCII lines
myPort.pipe(parser);												// pipe the serial stream to the parser

myPort.on('open', openPort);			// called when the serial port opens
myPort.on('close', closePort);		// called when the serial port closes
myPort.on('error', serialError);	// called when there's an error with the serial port
parser.on('data', listen);				// called when there's new data incoming

function openPort() {
	var brightness = 0;				// the brightness to send for the LED
	console.log('port open');

	// since you only send data when the port is open, this function
	// is local to the openPort() function:
	function sendData() {
		// convert the value to an ASCII string before sending it:
		myPort.write(brightness.toString());
		console.log("Sending " + brightness + " out the serial port");
		// increment brightness by 10 points. Rollover if > 255:
		if (brightness < 255) {
			brightness+= 10;
		} else {
			brightness = 0;
		}
	}
	// set an interval to update the brightness 2 times per second:
	setInterval(sendData, 500);
}

function listen(data) {
	console.log("I am listening!!!");
	console.log(data);
}

function closePort() {
	console.log('port closed');
}

function serialError(error) {
	console.log('there was an error with the serial port: ' + error);
	myPort.close();
}
