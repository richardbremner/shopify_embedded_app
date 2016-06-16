var app = require('../app'),
	request = require("request");

exports.getAccessToken = function(environment) {
	// var options = {
	// 	protocol: 'https:',
	// 	host: `accounts${env}.iqmetrix.net`,
	// 	path: '/v1/oauth2/token',
	// 	method: 'POST'
 //  	};

 //  	var body = {
	// 	grant_type: app.nconf.get('iq_oauth:grant_type'),
	// 	client_id: app.nconf.get('iq_oauth:client_id'),
	// 	client_secret: app.nconf.get('iq_oauth:client_secret'),
	// 	username: app.nconf.get('iq_oauth:username'),
	// 	password: app.nconf.get('iq_oauth:password'),
	// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
 //  	}
	
	// options.body = JSON.stringify(body);
	// console.log(options);
	// return got(options).then(res => {
	// 	const body = res.body;
	// 	console.log(body);
	// 	return body['access_token'] || {};
	// }, err => {
	// 	console.log(err);
	// 	console.log('error!');
	// 	return Promise.reject(err);
	// });

	var options = { 
		method: 'POST',
		url: `https://accounts${environment}.iqmetrix.net/v1/oauth2/token`,
		headers: { 
			'content-type': 'application/x-www-form-urlencoded' 
		},
		form: { 
			grant_type: app.nconf.get('iq_oauth:grant_type'),
			client_id: app.nconf.get('iq_oauth:client_id'),
			client_secret: app.nconf.get('iq_oauth:client_secret'),
			username: app.nconf.get('iq_oauth:username'),
			password: app.nconf.get('iq_oauth:password') 
		} 
	};

	request(options, function (error, response, body) {
		body = JSON.parse(body);
		if (error)
			throw new Error(error);
		return (body['access_token']);
	});
}