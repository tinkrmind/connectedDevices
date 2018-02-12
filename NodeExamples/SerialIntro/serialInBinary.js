/*
serialInBinary.js

Tests the functtionality of the serial port library
To be used in conjunction with the Arduino sketch called AnalogReadWriteBinary.ino,
in this repository.

This script expects a steady stream of input
from the serial port in binary form. Interprets each byte as its
raw value, not as a character

To call this from the command line:

node serialInBinary.js portname

where portname is the path to the serial port.

refactored to get rid of anonymous functions, to make it clearer for
those new to JavaScript

created 21 Aug 2012
modified 26 Sept 2017
by Tom Igoe

*/

// serial port initialization:
var SerialPort = require('serialport');			// include the serialport library
var	portName =  process.argv[2];						// get the port name from the command line
const myPort = new SerialPort(portName);		// open the serial port

myPort.on('open', openPort);			// called when the serial port opens
myPort.on('close', closePort);		// called when the serial port closes
myPort.on('error', serialError);	// called when there's an error with the serial port
myPort.on('data', listen);				// called when there's new incoming serial data

function openPort() {
	console.log('port open');
}

function closePort() {
	console.log('port closed');
}

function serialError(error) {
	console.log('there was an error with the serial port: ' + error);
	myPort.close();
}

function listen(data) {
	// data buffer will be variable length
	// depending on how fast the transmitting device is sending.
	// read each byte of the buffer:
	for (var c=0; c<data.length; c++) {
		console.log(data.readUInt8(c));
	}
}
