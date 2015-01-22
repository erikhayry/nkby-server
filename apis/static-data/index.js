var html, json;

html = require('../../services/html');

json = require('../../services/json');

module.exports = function(app) {
  app.param('path', function(req, res, next, path) {
    req.newpath = path.replace(/-/g, '/');
    return next();
  });
  app.get('/static/json/:path', function(req, res, next) {
    return json.get(req.newpath + '.json').then(function(data) {
      return res.send(data);
    }, function(err) {
      return res.send('unable to get json for ' + req.newpath);
    });
  });
  app.get('/static/html/:path', function(req, res, next) {
    return html.get(req.newpath + '.html').then(function(data) {
      return res.send(data);
    }, function(err) {
      return res.send('unable to get html data for ' + req.newpath);
    });
  });
  return app;
};

//# sourceMappingURL=index.js.map