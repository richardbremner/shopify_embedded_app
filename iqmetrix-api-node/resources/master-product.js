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
function MasterProduct(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'productlibrary';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(MasterProduct.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
MasterProduct.prototype.createMasterProduct = function (masterProduct) {
	var path = (`/v1/ProductDocs`);
	return this.create(path, MasterProduct);
};

MasterProduct.prototype.updateMasterProduct = function (masterProduct, productId) {
	var id = productId || '';
	
	if(id === '')
		id = masterProduct.Id || '';

	var path = (`/v1/ProductDocs/${id}`);
	return this.update(path, masterProduct);
};

MasterProduct.prototype.deleteMasterProduct = function (masterProduct, productId) {
	var id = productId || '';
	
	if(id === '')
		id = masterProduct.Id || '';

	var path = (`/v1/ProductDocs/${id}`);
	return this.delete(path);
};

module.exports = MasterProduct;
