/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	express = require('express'),
	routes = require('./routes'),
	shopifyAuth = require('./routes/shopify_auth'),
	path = require('path'),
	nconf = require('nconf'),
	morgan = require('morgan'),
	iqmetrixAuth = require('./routes/iqmetrix_auth'),
	Customer = require('./iqmetrix-api-node/resources/customer'),
	iQmetrix = require('./iqmetrix-api-node'),
	iqmetrixController = require('./iqmetrix-api-node/mixins/stuff'),
	q = require('q'),
	CustomerMapper = require('./mappers/customer-mapper'),
	Shopify = require('shopify-api-node');

//load settings from environment config
nconf.argv().env().file({
	file: (process.env.NODE_ENV || 'dev') + '-settings.json'
});
exports.nconf = nconf;

const regex = {
	postCode: {
		CA: /^([ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ][\s\-]?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$)/g,
		US: /^\d{5}$|^\d{9}$/g,
		AU: /^\d{4}$/g
	}
}
exports.regex = regex;

//configure express
var app = express();

//log all requests
app.use(morgan('combined'));

//support json and url encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup encrypted session cookies
app.use(cookieParser());
app.use(cookieSession({
	secret: "--express-session-encryption-key--"
}));

//statically serve from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//use jade templating engine for view rendering
app.set('view engine', 'jade');

//use the environment's port if specified
app.set('port', process.env.PORT || 3000);
var appAuth = new shopifyAuth.AppAuth();

var iqmetrix;
var customer;
var shopify = new Shopify('iqmetrix-test-store', '8b8663edac84a60ebc856a90eb3bfecf');
iqmetrixAuth.getAccessToken('demo', function(token){
	console.log(token);
	iqmetrix = new iQmetrix(token, 'demo');
	cm = new CustomerMapper(iqmetrix, shopify);
	//cm.runTheTest();
	cm.syncCustomers(new Date('2016-06-22T15:24:40-04:00'));
});
  //.then(function(data){
// 	console.log(data.value);
// });
iqmetrixController.getItems('asdfasdf');
//iqmetrixController.performRequest('/v1/Companies(14146)/InvoiceSummaries', 'GET', '', function(data) {
//	console.log('Fetched ' + data.Id + ' cards');
 // });

//configure routes
app.get('/', routes.index);
app.get('/auth_app', appAuth.initAuth);
app.get('/escape_iframe', appAuth.escapeIframe);
app.get('/auth_code', appAuth.getCode);
app.get('/auth_token', appAuth.getAccessToken);
app.get('/render_app', routes.renderApp);
var server = app.listen(app.get('port'), function() {
	console.log(`Listening at port ${server.address().port}`);
});