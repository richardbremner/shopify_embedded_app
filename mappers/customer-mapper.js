'use strict';
const app = require('../app');
const iqCustomer = require('../iqmetrix-api-node/resources/customer');
const iqCustomerAddress = require('../iqmetrix-api-node/resources/customer-address');
const iqCustomerContactMethod = require('../iqmetrix-api-node/resources/customer-contact-method');
const shopifyCustomer = require('shopify-api-node/resources/customer');
const linq = require('jslinq');
const nconf = require('nconf');

//Controllers for making API calls
var customerController;
var addressController;
var contactMethodController;
var shopifyCustomerController;

//Private variables
var addressTypeId, customerTypeId, mappingFieldId;

/**
 * Creates a Customer Mapper instance.
 *
 * @param {iqmetrix} iqmetrix Reference to the iQmetrix instance
 * @param {shopify} shopify Reference to the Shopify instance
 * @constructor
 * @public
 */
function CustomerMapper(iqmetrix, shopify){
	this.iqmetrix = iqmetrix;
	this.shopify = shopify;
	customerController = new iqCustomer(iqmetrix);
	addressController = new iqCustomerAddress(iqmetrix);
	contactMethodController = new iqCustomerContactMethod(iqmetrix);
	shopifyCustomerController = new shopifyCustomer(shopify);
}

/**
 * Performs a test on the CutomerMapper
 *
 * @public
 */
CustomerMapper.prototype.runTheTest = function(){
	// customerController.createCustomer({
	// 	"CustomerTypeId": 2
	// }).then(function(cust){
	// 	console.log(cust);
	// 	cust.Title = "newTitle";
	// 	console.log('ABOUT TO UPDATE');
	// 	return customerController.updateCustomer(cust);
	// }).then(function(cust1){
	// 	console.log(cust1);
	// 	console.log('ABOUT TO DELETE');
	// 	return customerController.deleteCustomer(cust1);
	// }).then(function(){
	// 	console.log('DELETED');
	// })
	getMappingFieldId().then(function(result){
		console.log(result);
	});
	getMappingFieldId().then(function(result){
		console.log(result);
	});
	getCustomersUpdated(new Date('2015-06-13T15:33:50')).then(function (res){
		console.log(res);
		hasMapping(res[0]).then(function(result){
			console.log(result);
			console.log(res[0]);
		});
	});
};

/**
 * Creates a Customer Mapper instance.
 *
 * @param {iqmetrix} iqmetrix Reference to the iQmetrix instance
 * @param {shopify} shopify Reference to the Shopify instance
 * @public
 */
CustomerMapper.prototype.syncCustomers = function (time){
	console.log('Start sync');

	var newCustomers;
	var existingCustomers;

	//Set the required field IDs
	getMappingFieldId()
	.then(function(result){
		mappingFieldId = result;
		return getCustomerTypeId()
	})
	.then(function(result){
		customerTypeId = result;
		return getAddressTypeId()
	})
	.then(function(result){
		addressTypeId = result;
		console.log('Map' + mappingFieldId);
		console.log('CustType' + customerTypeId);
		console.log('Address' + addressTypeId);	

		//Get customers
		return getCustomersUpdated(time)
	})
	.then(function (shopifyCustomers){
		console.log('Determining updates or creates');
		for(var i = 0; i < shopifyCustomers.length; ++i){
			//Determine if new or existing customer
			//Do insert or update accordingly
			hasMapping(shopifyCustomers[i])
			.then(function(result){
				console.log('mapped = ' + result);
				if(result){
					console.log('about to update');
					doUpdateCustomer(shopifyCustomers[i]);
				}
				else{
					console.log('about to create');
					doCreateCustomer(shopifyCustomers[i]);
				}
			});
		}
	});
};

/**
 * Gets the Mapping Field Id used for iQmetrix
 */
function getMappingFieldId(){
	return customerController.retrieveCustomerExtensionTypes()
	.then(function(result){
		return linq(result).firstOrDefault(function(x) {return x.Name === 'CorrelationId'});
	})
	.then(function(result){
		return result.Id;
	});
}

/**
 * Gets the Customer Type Id for the 'Person' type
 */
function getCustomerTypeId(){
	return customerController.retrieveCustomerTypes()
	.then(function(result){
		return linq(result).firstOrDefault(function(x) {return x.Name === 'Person'});
	})
	.then(function(result){
		return result.Id;
	});
}

/**
 * Gets the Address Type Id for the 'Shipping' type
 */
function getAddressTypeId(){
	return addressController.retrieveAddressTypes()
	.then(function(result){
		return linq(result).firstOrDefault(function(x) {return x.Name === 'Shipping'});
	})
	.then(function(result){
		return result.Id;
	});
}


function getCustomersUpdated(time){
	console.log(time);
	return shopifyCustomerController.search().then(function(result){
		return linq(result).where(function(x) {return new Date(x.updated_at) > time}).items;
	});
}

function doCreateCustomer(shopifyCustomer){
	console.log('Doing creation on ' + shopifyCustomer.id);
	//Build the generic customer object for iQmetrix including mapping to Shopify customer ID
	let newCustomer = {
		PrimaryName: shopifyCustomer.first_name || '',
		MiddleName: '',
		FamilyName: shopifyCustomer.last_name || '',
		Addresses: [],
		ContactMethods: [],
		CustomerExtensions: [
			{
				ExtensionTypeId: mappingFieldId,
				Value: shopifyCustomer.id
			}
		],
		CustomerTypeId: customerTypeId,
		Disabled: false
	}

	//Add Addresses if they exist
	if('addresses' in shopifyCustomer){
		for (var i = 0; i < shopifyCustomer.addresses.length; ++i){
			newCustomer.Addresses.push(iQAddressFromShopifyAddress(shopifyCustomer.addresses[i], shopifyCustomer.email));
		}
	}
	
	//Create and map customer
	customerController.createCustomerFull(newCustomer)
	.then(function(customer){
		shopifyCustomerController.update(newCustomer.id, {
			id: newCustomer.id,
			metafields: [
				{
					key: 'iqmetrixidentifier',
					value: customer.Id,
					value_type: 'string',
					namespace: 'global'
				}
			]
		})
	});
}

/**
 * NOTE: 
 *	shopifyCustomer must have 'metafields' property
 */
function doUpdateCustomer(shopifyCustomer){
	console.log('Doing update on ' + shopifyCustomer.id);
	var iqmetrixCustomerId = linq(shopifyCustomer.metafields)
		.firstOrDefault(function(x) {return x.key === 'iqmetrixidentifier'}).value;

	var shopifyAddresses = ('addresses' in shopifyCustomer) ? shopifyCustomer.addresses : [];
	var iqmetrixAddresses = [];
	var toCreate = [], toDelete = [];

	customerController.retrieveCustomerFull(iqmetrixCustomerId)
	.then(function (customerFull){
		iqmetrixAddresses = customerFull.Addresses;

		//Go through shopify addresses to find new ones
		for (var i = 0; i < shopifyAddresses.length; ++i){
			var postCode = getValidPostCode(shopifyAddresses[i].zip, shopifyAddresses[i].country_code);
			if(!linq(iqmetrixAddresses)
				.any(function(x) {
					return x.StreetAddress1 === shopifyAddresses[i].address1 && 
					x.StreetAddress2 === shopifyAddresses[i].address2 &&
					x.StateCode === shopifyAddresses[i].province_code && 
					x.State === shopifyAddresses[i].province && 
					x.PostalCode === postCode && 
					x.CountryCode === shopifyAddresses[i].country_code && 
					x.Country === shopifyAddresses[i].country
				})
			){
				toCreate.push(shopifyAddresses[i]);
			}
		}

		//Go through iqmetrix addresses to find ones to delete
		for (var i = 0; i < iqmetrixAddresses.length; ++i){
			if(!linq(shopifyAddresses)
				.any(function(x) {
					return iqmetrixAddresses[i].StreetAddress1 === x.address1 && 
					iqmetrixAddresses[i].StreetAddress2 === x.address2 &&
					iqmetrixAddresses[i].StateCode === x.province_code && 
					iqmetrixAddresses[i].State === x.province && 
					(iqmetrixAddresses[i].PostalCode === postCode || iqmetrixAddresses[i].PostalCode === '') && 
					iqmetrixAddresses[i].CountryCode === x.country_code && 
					iqmetrixAddresses[i].Country === x.country
				})
			){
				toDelete.push(iqmetrixAddresses[i]);
			}
		}

		//Do all creations and deletions for addresses necessary
		for (var i = 0; i < toCreate.length; ++i){
			addressController.createAddress(iQAddressFromShopifyAddress(toCreate[i], shopifyCustomer.email));
		}

		for (var i = 0; i < toDelete.length; ++i){
			addressController.deleteAddress(toDelete[i]);
		}
	});
}

/**
 * Checkes if a shopify customer has a mapping.
 * Adds metafields for the customer to the customer object.
 */
function hasMapping(shopifyCustomer){
	console.log('Checking mapping on ' + shopifyCustomer.id);
	return shopifyCustomerController.retrieveMetaFields(shopifyCustomer.id)
	.then(function (metafields){
		shopifyCustomer.metafields = metafields;
		return linq(metafields).any(function(x) {return x.key === 'iqmetrixidentifier'});
	});
}

/**
 * Validates a postcode and countrycode pair to ensure a valid postcode is returned.
 * If the postcode is invalid then '' is returned.
 */
function getValidPostCode(postCode, countryCode){
	var result = postCode;
	if(countryCode === 'CA' || countryCode === 'US' || countryCode === 'AU'){
		var regex = new RegExp(app.nconf.get(`regex:postCode:${countryCode}`));
		if (!regex.test(postCode)){
			result = '';
		}
	}
	return result;
}

function iQAddressFromShopifyAddress(shopifyAddress, email){
	var postCode = getValidPostCode(shopifyAddress.zip, shopifyAddress.country_code);
	return {
		AddressTypeId: addressTypeId,
		CountryCode: shopifyAddress.country_code,
		Country: shopifyAddress.country,
		Default: shopifyAddress.default,
		DoNotContact: false,
		Email: email || '',
		Phone: shopifyAddress.phone || '',
		PostalCode: postCode || '',
		StateCode: shopifyAddress.province_code || '',
		StreetAddress1: shopifyAddress.address1 || '',
		StreetAddress2: shopifyAddress.address2 || ''
	};
}

module.exports = CustomerMapper;
