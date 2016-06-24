'use strict';

const camelCase = require('lodash/camelCase');
const assign = require('lodash/assign');
const path = require('path');
const got = require('got');
const fs = require('fs');
const nconf = require('nconf');
const FormData = require('form-data');
const form = new FormData();
const querystring = require('querystring');


/**
 * Creates a Shopify instance.
 *
 * @param {String} shop The name of the shop
 * @param {String} key The API Key
 * @param {String} password The password
 * @constructor
 * @public
 */
function iQmetrix(key, env) {
	if (!(this instanceof iQmetrix)) return new iQmetrix(key, env);

	this.token = key;
	this.environment = env;
	this.languageCode = nconf.get('gereral:language_code');
	this.baseUrl = {
		environment: env,
		protocol: 'https:',
		auth: key
	};
}

/**
 * Sends a request to a Shopify API endpoint.
 *
 * @param {Object} url URL object
 * @param {String} method HTTP method
 * @param {Object} [params] Request body or query string if GET request
 * @return {Promise}
 * @private
 */
iQmetrix.prototype.request = function request(host, path, method, params, filePath) {
	console.log('iQmetrix doing a ' + method + ' at ' + path);
	if (method == 'GET' && params) {
		path += '?' + querystring.stringify(params);
	}

	var headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	};

	var options = {
		protocol: this.baseUrl.protocol,
		host: host,
		path: path,
		method: method,
		headers: headers
  	};

	if (this.token) {
		options.headers['Authorization'] = `Bearer ${this.token}`;
	}

	if(host.includes('productlibrary')) {
		options.headers['Accept-Language'] = this.languageCode;
	}

	if (params) {
		const body = params;
		options.body = JSON.stringify(body);
	}else if(filePath) {
		let fileName = filePath.substring(filePath.lastIndexOf('/'));
		form.append(fileName, fs.createReadStream(filePath));
		options.body = form;
		options.headers.push(form.getHeaders());
	}

	return got(options).then(res => {
		const body = res.body;

		if (body){
			return JSON.parse(body);
		}
		return {};

	}, err => {
		console.log(err);
		return Promise.reject(err);
	});
};


// iQmetrix.prototype.request = function (url, method, data, success) {
// 	var dataString = JSON.stringify(data);
// 	var headers = {};
  
// 	if (method == 'GET') {
// 		url += '?' + querystring.stringify(data);
// 	}

// 	headers = {
// 		'Content-Type': 'application/json',
// 		'Content-Length': dataString.length,
// 		'Authorization': `Bearer ${OAuthToken}`
// 	};
  
//   var options = {
// 	host: host,
// 	path: url,
// 	method: method,
// 	headers: headers
//   };
//   console.log(options);

//   var req = https.request(options, function(res) {
// 	res.setEncoding('utf-8');

// 	var responseString = '';

// 	res.on('data', function(data) {
// 	  responseString += data;
// 	});

// 	res.on('end', function() {
// 	  var responseObject = JSON.parse(responseString);
// 	  console.log(responseObject);
// 	  success(responseObject);
// 	});
//   });

//   req.write(dataString);
//   req.end();
// }
module.exports = iQmetrix;
