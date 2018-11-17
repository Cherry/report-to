Report To
==============
[![Build Status](https://travis-ci.org/cherry/report-to.svg?branch=master)](https://travis-ci.org/cherry/report-to)

This is Express middleware to set the `Report-To` header. You can read more about it [here](https://www.w3.org/TR/reporting).

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

When set alone, this header doesn't do anything and will need to be set with a header that allows report, such as `Content-Security-Policy`, `NEL`, etc.

For example, using the above definition, a `NEL` header may look like the following, using `endpoint-1` as its `report-to` parameter:
```NEL: {"report_to":"endpoint-1","max_age":31536000,"include_subdomains":true}```
