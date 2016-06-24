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
function Invoice(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'invoice';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(Invoice.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
Invoice.prototype.retrieveInvoice = function (invoice) {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/Invoices(${invoice.Id})`);
	return this.retrieve(path);
};

Invoice.prototype.retrieveSummaries = function () {
	var companyId = app.nconf.get('iq_settings:companyId');
	var path = (`/v1/companies(${companyId})/InvoiceSummaries`);
	return this.retrieve(path);
};

/**
 * Generates and retrieve an account activation URL for a customer.
 *
 * @param {Number} id Customer ID
 * @return {Promise} Promise that resolves with the result
 * @public
 */


module.exports = Invoice;
