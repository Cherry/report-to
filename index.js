'use strict';
const validate = require('./lib/validate');

module.exports = function reportTo(options){
	validate(options);

	const headerValue = options.groups.map(JSON.stringify).join(',');

	return function reportTo(req, res, next){
		res.setHeader('Report-To', headerValue);
		return next();
	};
};