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
function HeroShot(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.service = 'productlibrary';
	this.host = `${this.service}${this.iqmetrix.baseUrl.environment}.iqmetrix.net`;
}
assign(HeroShot.prototype, base);

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
HeroShot.prototype.updateHeroShot = function (asset, slug) {
	var path = (`/ProductManager/products/${slug}/heroshot`);
	return this.update(path, asset);
};

module.exports = HeroShot;
