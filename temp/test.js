var html, json;

html = require('../services/html');

json = require('../services/json');


/*json.get './backup/1421918588069_nkby.testData.json'
	.then (data) -> 
			console.log data
		, (err) -> 
			console.log 'unable to read file'
 */

json.buildDb('sidor');

//# sourceMappingURL=test.js.map
