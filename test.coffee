html = require './services/html'

html 'test.html'
	.then (data) -> console.log data