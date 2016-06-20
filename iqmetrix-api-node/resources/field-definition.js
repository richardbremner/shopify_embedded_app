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
function FieldDefinition(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'productlibrary';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(FieldDefinition.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
FieldDefinition.prototype.retrieveAll = function () {
	var path = (`/v1/FieldDefinitions`);
	return this.retrieve(path);
};

module.exports = FieldDefinition;
