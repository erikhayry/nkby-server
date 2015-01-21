var html;

html = require('./services/html.js');

html('test.html').then(function(data) {
  return console.log(data);
});

//# sourceMappingURL=test.js.map
