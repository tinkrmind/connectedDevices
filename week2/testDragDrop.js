var express = require('express')
var server = express();					            // create a server using express

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var $form = $('.box');

if (isAdvancedUpload) {
  $form.addClass('has-advanced-upload');
}

server.listen(8080);                        // listen for HTTP
server.use('/',express.static('public'));   // set a static file directory