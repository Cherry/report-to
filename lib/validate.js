'use strict';

function isObject(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

module.exports = function validate(options) {
	if (!isObject(options)) {
		throw new Error('reportTo must be called with an object argument.');
	}
	if (!options.groups || !Array.isArray(options.groups)) {
		throw new Error('`groups` must be an array of report groups.');
	}
	if (options.groups.length === 0) {
		throw new Error('`groups` must contain at least 1 object.');
	}
	for (const group of options.groups) {
		if (!group.max_age) {
			throw new Error('The `max_age` parameter is required for every defined group.');
		}
		if (typeof(group.max_age) !== 'number' || group.max_age <= 0) {
			throw new Error('The `max_age` parameter must be a positive integer.');
		}
		if (!group.endpoints) {
			throw new Error('The `endpoints` parameter is required for every defined group.');
		}
		if ((group.group) !== undefined && typeof(group.group) !== 'string') {
			throw new TypeError('The `group` parameter must be a string if set.');
		}
		if (group.include_subdomains && typeof(group.include_subdomains) !== 'boolean') {
			throw new Error('The `include_subdomains` parameter must be a boolean if set.');
		}
		if (!Array.isArray(group.endpoints) || group.endpoints.length === 0) {
			throw new Error('The `endpoints` must be an array of endpoints.');
		}
		for (const endpoint of group.endpoints) {
			if (!endpoint.url) {
				throw new Error('The `endpoint.url` parameter must be set on every endpoint');
			}
			if (endpoint.priority && typeof(endpoint.priority) !== 'number' || endpoint.priority <= 0) {
				throw new Error('The `endpoint.priority parameter must be a positive integer if set.');
			}
			if (endpoint.weight && typeof(endpoint.weight) !== 'number' || endpoint.weight <= 0) {
				throw new Error('The `endpoint.weight parameter must be a positive integer if set.');
			}
		}
	}
};
