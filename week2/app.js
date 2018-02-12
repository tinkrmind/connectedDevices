/*
  A static file server in node.js.
  Put your static content in a directory next to this called public.
  context: node.js
*/
var express = require('express');           // include the express library
var server = express();					            // create a server using express

var url = '192.168.1.7/api/o7YhSFvxUuk-GMFtswL7BRPremAR6pPoAd7L0TRh/lights/32/state'
var content = JSON.stringify('"on":true')
httpDo(url, 'PUT', content, 'text')

server.listen(8080);                        // listen for HTTP
server.use('/',express.static('public'));   // set a static file directory