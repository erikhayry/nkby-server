var html;

html = require('./services/html');

html('test.html').then(function(data) {
  return console.log(data);
});

//# sourceMappingURL=test.js.map
