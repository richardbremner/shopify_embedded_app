'use strict';


/**
 * This provides methods used by resources that have no relationships with
 * other resources. It's not meant to be used directly.
 *
 * @mixin
 */
const base = {

	/**
	 * Creates a new record.
	 *
	 * @param {Object} params Record properties
	 * @return {Promise} Promise that resolves with the result
	 * @public
	 */
	create(path, toCreate, filePath) {
		return this.iqmetrix.request(this.host, path, 'POST', toCreate, filePath);
	},

	/**
	 * Deletes a record.
	 *
	 * @param {Number} id Record ID
	 * @return {Promise} Promise that resolves with the result
	 * @public
	 */
	delete(path) {
		return this.iqmetrix.request(this.host, path, 'DELETE');
	},

	/**
	 * Gets a single record by its ID.
	 *
	 * @param {Number} id Record ID
	 * @param {Object} [params] Query parameters
	 * @return {Promise} Promise that resolves with the result
	 * @public
	 */
	retrieve(path, query) {
		return this.iqmetrix.request(this.host, path, 'GET', query);
	},

	/**
	 * Updates a record.
	 *
	 * @param {Number} id Record ID
	 * @param {Object} params Record properties
	 * @return {Promise} Promise that resolves with the result
	 * @public
	 */
	update(path, toUpdate) {
		return this.iqmetrix.request(this.host, path, 'PUT', toUpdate);
	},
};

module.exports = base;
