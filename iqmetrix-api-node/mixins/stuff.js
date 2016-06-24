var querystring = require('querystring');
var https = require('https');
var util = require('util');

exports.getItems = function(argument) {
	console.log('HELLO');
}

var host = 'invoicedemo.iqmetrix.net'
var OAuthToken = 'VU5sVUVEbFVVeGxVVU9sVVVPVRs4Cl4zGg8qYyI9GDYZLzo2LTQNDBQMNgQgDSIMYgQ6OWwGKzkUGRYlPi85Ow1_BGIfAzYsIyIB';

exports.performRequest = function (endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }

	headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': dataString.length,
	  'Authorization': `Bearer ${OAuthToken}`
	};
  
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };
  console.log(options);

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var responseObject = JSON.parse(responseString);
      console.log(responseObject);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}