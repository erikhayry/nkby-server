var Path, Url;

Path = require('path');

Url = require('../../services/url');

module.exports = function(app, db) {
  app.param('collectionName', function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
  });
  app.param('parent', function(req, res, next, parent) {
    req.parent = {
      "parent": Path.normalize("/" + Url.encode(parent)),
      "trashed": {
        $ne: true
      }
    };
    return next();
  });
  app.param('newPath', function(req, res, next, newPath) {
    req.newPath = Path.normalize("/" + Url.encode(newPath));
    return next();
  });
  app.param('id', function(req, res, next, id) {
    req.id = id;
    return next();
  });
  app.get('/', function(req, res, next) {
    return res.send('please select a collection, e.g., /collections/messages');
  });
  app.get('/collections/tree/:parent', function(req, res, next) {
    return db.collection('tree').find(req.parent, {
      limit: 0,
      sort: {
        '_id': 1
      }
    }).toArray(function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.put('/collections/tree/:newPath', function(req, res, next) {
    return db.collection('tree').updateById(req.newPath, {
      $set: req.body
    }, {
      safe: true,
      multi: false
    }, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.get('/collections/map/:latitude/:longitude', function(req, res, next) {
    return db.collection('map').find({
      latitude: req.params.latitude,
      longitude: req.params.longitude
    }, {
      limit: 0,
      sort: {
        '_id': 1
      }
    }).toArray(function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.get('/collections/:collectionName', function(req, res, next) {
    return req.collection.find({}, {
      limit: 10,
      sort: {
        '_id': 1
      }
    }).toArray(function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.post('/collections/:collectionName', function(req, res, next) {
    return req.collection.insert(req.body, {}, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.get('/collections/:collectionName/:id', function(req, res, next) {
    return req.collection.findById(req.id, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.put('/collections/:collectionName/:id', function(req, res, next) {
    return req.collection.updateById(req.id, req.body, {
      safe: true,
      multi: false
    }, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app["delete"]('/collections/:collectionName/:id', function(req, res, next) {
    return req.collection.removeById(req.id, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  return app;
};

//# sourceMappingURL=index.js.map
