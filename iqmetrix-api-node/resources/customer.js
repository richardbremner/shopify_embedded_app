'use strict';
var app = require('../../app');
const assign = require('lodash/assign');
const nconf = require('nconf');
const base = require('../mixins/base');

/**
 * Creates a Customer instance.
 *
 * @param {Shopify} shopify Reference to the Shopify instance
 * @constructor
 * @public
 */
function Customer(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'crm';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(Customer.prototype, base);
/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
Customer.prototype.createCustomer = function (customer) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers`);
	return this.create(path, customer);
};

Customer.prototype.createCustomerFull = function (customerFull) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/CustomerFull`);
	return this.create(path, customerFull);
};

Customer.prototype.retrieveCustomerExtensionTypes = function() {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = `/v1/Companies(${companyId})/CustomerExtensionTypes`;
	return this.retrieve(path);
}

Customer.prototype.retrieveCustomerTypes = function() {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = `/v1/Companies(${companyId})/CustomerTypes`;
	return this.retrieve(path);
}

Customer.prototype.retrieveCustomerFull = function(customerId) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = `/v1/Companies(${companyId})/CustomerFull(${customerId})`;
	return this.retrieve(path);
}

Customer.prototype.updateCustomer = function (customer) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${customer.Id})`);
	return this.update(path, customer);
};

Customer.prototype.deleteCustomer = function (customer) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${customer.Id})`);
	return this.delete(path);
};


module.exports = Customer;
