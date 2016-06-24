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
function Variation(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'productlibrary';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(Variation.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
Variation.prototype.createVariation = function (variation, productId) {
	var path = (`/v1/ProductDocs/${productId}/variations`);
	return this.create(path, variation);
};

Variation.prototype.updateVariation = function (variation, productId, variationId) {
	var id = variationId || '';
	
	if(id === '')
		id = variation.Id || '';

	var path = (`/v1/ProductDocs/${productId}/variations?variationId=${id}`);
	return this.update(path, variation);
};

module.exports = Variation;
