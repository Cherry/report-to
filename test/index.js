'use strict';
/* global describe, it */
const reportTo = require('..');
const connect = require('connect');
const supertest = require('supertest');
const assert = require('assert');

function app(){
	const app = connect();
	app.use(Reflect.apply(reportTo, null, arguments));
	app.use(function(req, res){
		return res.end('Hello world!');
	});
	return app;
}

describe('reportTo', function(){
	it('fails without at least 1 group', function(){
		assert.throws(() => reportTo(), Error);
		assert.throws(() => reportTo({}), Error);
		assert.throws(() => reportTo({groups: null}), Error);
		assert.throws(() => reportTo({groups: undefined}), Error);
		assert.throws(() => reportTo({groups: []}), Error);
		assert.throws(() => reportTo({groups: {}}), Error);
	});

	it('fails when groups is missing `max_age`', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				},
				{
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('fails when group has a bad `max_age` value', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: -1,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				},
				{
					max_age: -1,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('fails when group has a bad `group` value', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					group: null,
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					group: 'one',
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				},
				{
					group: 123,
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('fails when group has a bad `include_subdomains` value', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					group: null,
					max_age: -1,
					include_subdomains: null,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					group: 'one',
					max_age: 123,
					include_subdomains: true,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				},
				{
					group: 'two',
					max_age: 123,
					include_subdomains: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('fails when groups is missing `endpoints`', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							url: 'https://example.com'
						}
					]
				},
				{
					max_age: 123
				}
			]
		}), Error);
	});

	it('fails when groups has a bad `endpoints` value', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: {foo: 'bar'}
				}
			]
		}), Error);

		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: []
				}
			]
		}), Error);
	});

	it('fails when groups is missing `endpoints.url`', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: 1
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: 1,
							url: 'https://example.com'
						}
					]
				},
				{
					max_age: 123,
					endpoints: [
						{
							priority: 2
						}
					]
				}
			]
		}), Error);
	});

	it('fails when groups has a bad `endpoints.priority`', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: -1,
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: 1,
							url: 'https://example.com'
						}
					]
				},
				{
					max_age: 123,
					endpoints: [
						{
							priority: "1",
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('fails when groups has a bad `endpoints.weight`', function(){
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: 1,
							weight: -1,
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
		assert.throws(() => reportTo({
			groups: [
				{
					max_age: 123,
					endpoints: [
						{
							priority: 1,
							weight: 1,
							url: 'https://example.com'
						}
					]
				},
				{
					max_age: 123,
					endpoints: [
						{
							priority: 2,
							weight: "-2",
							url: 'https://example.com'
						}
					]
				}
			]
		}), Error);
	});

	it('expect individual report group', function(){
		return supertest(app({
			groups: [
				{
					group: "endpoint-1",
					max_age: 10_886_400,
					endpoints: [
						{
							url: "https://example.com/reports",
							priority: 1
						},
						{
							url: "https://backup.com/reports",
							priority: 2
						}
					]
				}
			]
		}))
			.get('/')
			.expect('Report-To', '{"group":"endpoint-1","max_age":10886400,"endpoints":[{"url":"https://example.com/reports","priority":1},{"url":"https://backup.com/reports","priority":2}]}')
			.expect('Hello world!');
	});

	it('expect multiple report groups', function(){
		return supertest(app({
			groups: [
				{
					group: "csp-endpoint",
					max_age: 10_886_400,
					endpoints: [
						{
							url: "https://example.com/csp-reports"
						}
					]
				},
				{
					group: "hpkp-endpoint",
					max_age: 10_886_400,
					endpoints: [
						{
							url: "https://example.com/hpkp-reports"
						}
					]
				}
			]
		}))
			.get('/')
			.expect('Report-To', '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"https://example.com/csp-reports"}]},{"group":"hpkp-endpoint","max_age":10886400,"endpoints":[{"url":"https://example.com/hpkp-reports"}]}')
			.expect('Hello world!');
	});

	it('names its function and middleware', function(){
		assert.strictEqual(reportTo.name, 'reportTo');
		assert.strictEqual(reportTo.name, reportTo({
			groups: [
				{
					group: "endpoint-1",
					max_age: 10_886_400,
					endpoints: [
						{
							url: "https://example.com/reports",
							priority: 1
						}
					]
				}
			]
		}).name);
	});
});