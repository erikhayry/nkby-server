html = require '../services/html'

html './temp/heavyTextExample.html'
	.then (data) -> console.log data

html './temp/faultyTextExample.html'
	.then (data) -> console.log data