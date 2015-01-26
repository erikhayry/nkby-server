module.exports = function(app, db) {
  app.param('collectionName', function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
  });
  app.get('/', function(req, res, next) {
    return res.send('please select a collection, e.g., /collections/messages');
  });
  app.get('/collections/:collectionName', function(req, res, next) {
    return req.collection.find({}, {
      limit: 10,
      sort: {
        '_id': -1
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
    return req.collection.findById(req.params.id, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result);
    });
  });
  app.put('/collections/:collectionName/:id', function(req, res, next) {
    return req.collection.updateById(req.params.id, {
      $set: req.body
    }, {
      safe: true,
      multi: false
    }, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result === 1 ? {
        msg: 'success'
      } : {
        msg: 'error'
      });
    });
  });
  app["delete"]('/collections/:collectionName/:id', function(req, res, next) {
    return req.collection.removeById(req.params.id, function(e, result) {
      if (e) {
        return next(e);
      }
      return res.send(result === 1 ? {
        msg: 'success'
      } : {
        msg: 'error'
      });
    });
  });
  return app;
};

//# sourceMappingURL=index.js.map
