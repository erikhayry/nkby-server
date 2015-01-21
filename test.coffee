html = require './services/html.js'

html 'test.html'
	.then (data) -> console.log data