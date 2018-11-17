Report To
==============
[![npm version](https://badge.fury.io/js/report-to.svg)](https://badge.fury.io/js/report-to)
[![dependencies Status](https://david-dm.org/Cherry/report-to/status.svg)](https://david-dm.org/Cherry/report-to)
[![Build Status](https://travis-ci.org/Cherry/report-to.svg?branch=master)](https://travis-ci.org/Cherry/report-to)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FCherry%2Freport-to.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FCherry%2Freport-to?ref=badge_shield)

This is Express middleware to set the `Report-To` HTTP response header. You can read more about it [here](https://www.w3.org/TR/reporting) and [here](https://scotthelme.co.uk/network-error-logging-deep-dive/).

To use:

```javascript
const reportTo = require('report-to')

// ...

app.use(reportTo({
    groups: [
		{
			group: "endpoint-1",
			max_age: 10886400,
			include_subdomains: true,
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
```

When set alone, this header doesn't do anything and will need to be set with a header that allows reporting, such as `Content-Security-Policy`, `NEL`, etc.

For example, using the above definition, a `NEL` header may look like the following, using `endpoint-1` as its `report-to` parameter:
```NEL: {"report_to":"endpoint-1","max_age":31536000,"include_subdomains":true}```

http://report-uri.com/ is a great reporting platform for monitoring CSP, NEL, etc. error logs.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FCherry%2Freport-to.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FCherry%2Freport-to?ref=badge_large)