var html;

html = require('../services/html');

html('./temp/heavyTextExample.html').then(function(data) {
  return console.log(data);
});

html('./temp/faultyTextExample.html').then(function(data) {
  return console.log(data);
});

//# sourceMappingURL=test.js.map
