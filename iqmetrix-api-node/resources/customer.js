'use strict';
var app = require('../../app');
const assign = require('lodash/assign');
const nconf = require('nconf');
const base = require('../controllers/base');

/**
 * Creates a Customer instance.
 *
 * @param {Shopify} shopify Reference to the Shopify instance
 * @constructor
 * @public
 */
function Customer(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.name = 'customers';
	this.key = 'customer';
	this.host = 'crm';
}

assign(Customer.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
Customer.prototype.create = function create(customer) {
	var companyId = app.nconf.get('iq_settings:companyId');
	const url = this.buildUrl(`/v1/companies(${companyId})/Customers`, params);
	return this.iqmetrix.request(url, 'POST', undefined, customer);
};

/**
 * Generates and retrieve an account activation URL for a customer.
 *
 * @param {Number} id Customer ID
 * @return {Promise} Promise that resolves with the result
 * @public
 */


module.exports = Customer;
