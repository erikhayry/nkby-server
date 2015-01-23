var html, json;

html = require('../services/html');

json = require('../services/json');

html.get('./temp/heavyTextExample.html').then(function(data) {
  return console.log(data);
});


/*json.get './backup/1421918588069_nkby.testData.json'
	.then (data) -> 
			console.log data
		, (err) -> 
			console.log 'unable to read file'
 */

//# sourceMappingURL=test.js.map
