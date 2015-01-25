html = require '../services/html'
json = require '../services/json'

html.get './sidor/46/00preview46.html'
	#.then (data) -> console.log data

#html.get './temp/faultyTextExample.html'
	#.then (data) -> console.log data

###json.get './backup/1421918588069_nkby.testData.json'
	.then (data) -> 
			console.log data
		, (err) -> 
			console.log 'unable to read file'###
		

#json.build 'sidor'
	#.then (data) -> console.log data
