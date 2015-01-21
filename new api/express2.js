var app, backup, bodyParser, db, express, fs, logger, mongoskin;

express = require('express');

mongoskin = require('mongoskin');

bodyParser = require('body-parser');

logger = require('morgan');

fs = require('fs');

app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('dev'));

db = mongoskin.db('mongodb://@localhost:27017/nkby', {
  safe: true
});

backup = function(name) {
  return db.collection(name.replace('nkby.', '')).find({}).toArray(function(e, result) {
    if (e) {
      return next(e);
    }
    fs.writeFileSync('backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify(result, null, '\t'));
    return console.log('backupped ' + name);
  });
};

db.collectionNames(function(err, items) {
  var item, o, _results;
  _results = [];
  for (o in items) {
    item = items[o];
    _results.push(backup(item.name));
  }
  return _results;
});

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

app.listen(3000, function() {
  return console.log('Express server listening on port 3001');
});

//# sourceMappingURL=express2.js.map
