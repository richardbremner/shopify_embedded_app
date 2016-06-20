'use strict';
var app = require('../app');
var Customer = require('../iqmetrix-api-node/resources/customer');
var CustomerAddress = require('../iqmetrix-api-node/resources/customer-address');
var CustomerContactMethod = require('../iqmetrix-api-node/resources/customer-contact-method');

/**
 * Creates a Customer instance.
 *
 * @param {Shopify} shopify Reference to the Shopify instance
 * @constructor
 * @public
 */
function CustomerMapper(iqmetrix) {
	this.iqmetrix = iqmetrix;
	this.customerController = new Customer(iqmetrix);
	this.addressController = new CustomerAddress(iqmetrix);
	this.customerController = new CustomerContactMethod(iqmetrix);
}

/**
 * Returns a list of customers matching the given search parameters.
 *
 * @param {Object} params Search parameters
 * @return {Promise} Promise that resolves with the result
 * @public
 */
CustomerMapper.prototype.runTheTest = function () {
	return this.customerController.createCustomer({
		"CustomerTypeId": 2
	}).then(function(cust){
		console.log(cust);
		cust.Title = "newTitle";
		console.log('ABOUT TO UPDATE');
		return this.customerController.updateCustomer(cust);
	}).then(function(cust1){
		console.log(cust1);
		console.log('ABOUT TO DELETE');
		return this.customerController.deleteCustomer(cust1);
	}).then(function(){
		console.log('DELETED');
	})
};

module.exports = CustomerMapper;
