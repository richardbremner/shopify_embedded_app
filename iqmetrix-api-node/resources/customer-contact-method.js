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
function CustomerContactMethod(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'crm';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(CustomerContactMethod.prototype, base);

CustomerContactMethod.prototype.createContactMethod = function (contactMethod) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${contactMethod.CustomerId})/ContactMethods`);
	return this.create(path, contactMethod);
};

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
CustomerContactMethod.prototype.retrieveContactMethodCategories = function () {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/ContactMethodCategories`);
	return this.retrieve(path);
};

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
CustomerContactMethod.prototype.retrieveContactMethodType = function (categoryId) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/ContactMethodCategories(${categoryId})/ContactMethodTypes`);
	return this.retrieve(path);
};

CustomerContactMethod.prototype.updateContactMethod = function (contactMethod) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${contactMethod.CustomerId})/ContactMethods(${contactMethod.Id})`);
	return this.update(path, contactMethod);
};

CustomerContactMethod.prototype.deleteContactMethod = function (contactMethod) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Customers(${contactMethod.CustomerId})/ContactMethods(${contactMethod.Id})`);
	return this.delete(path);
};

module.exports = CustomerContactMethod;
