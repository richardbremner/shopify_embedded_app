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
function CustomerAddress(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'crm';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(CustomerAddress.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
CustomerAddress.prototype.createAddress = function (address) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${address.CustomerId})/Addresses`);
	return this.create(path, address);
};

CustomerAddress.prototype.updateAddress = function (address) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${address.CustomerId})/Addresses(${address.Id})`);
	return this.update(path, address);
};

CustomerAddress.prototype.deleteAddress = function (address) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${address.CustomerId})/Addresses(${address.Id})`);
	return this.delete(path);
};

CustomerAddress.prototype.retrieveAddressTypes = function () {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/AddressTypes`);
	return this.retrieve(path);
};

module.exports = CustomerAddress;
