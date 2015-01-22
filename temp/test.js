var html, json;

html = require('../services/html');

json = require('../services/json');

html.get('./temp/heavyTextExample.html');

html.get('./temp/faultyTextExample.html');

json.get('./backup/1421918588069_nkby.testData.json').then(function(data) {
  return console.log(data);
}, function(err) {
  return console.log('unable to read file');
});


/*json.build './data'
	.then (data) -> console.log data
 */

//# sourceMappingURL=test.js.map
