var Html, Json, urlencode;

Html = require('../../services/html');

Json = require('../../services/json');

urlencode = function(str) {
  return str.replace(/&046/g, ".").replace(/&047/g, "/");
};

module.exports = function(app) {
  app.param('path', function(req, res, next, path) {
    req.newpath = urlencode(path);
    return next();
  });
  app.get('/static/json/:path', function(req, res, next) {
    return Json.get(req.newpath).then(function(data) {
      return res.send(data);
    }, function(err) {
      return res.send('unable to get json for ' + req.newpath);
    });
  });
  app.get('/static/html/:path', function(req, res, next) {
    return Html.get(req.newpath).then(function(data) {
      return res.send(data);
    }, function(err) {
      return res.send('unable to get html data for ' + req.newpath);
    });
  });
  return app;
};

//# sourceMappingURL=index.js.map
