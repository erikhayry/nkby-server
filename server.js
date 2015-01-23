var BodyParser, Cors, DApi, Express, Logger, Mongoskin, StaticDataApi, Writefile, _Backup, _app, _db;

Express = require('express');

Mongoskin = require('mongoskin');

BodyParser = require('body-parser');

Logger = require('morgan');

Writefile = require('writefile');

Cors = require('cors');

DApi = require('./apis/db');

StaticDataApi = require('./apis/static-data');

_app = Express();

_app.use(Cors());

_app.use(BodyParser.json());

_app.use(BodyParser.urlencoded({
  extended: true
}));

_app.use(Logger('dev'));

_db = Mongoskin.db('mongodb://@localhost:27017/nkby', {
  safe: true
});

if (process.argv[2] !== '-ignore') {
  _Backup = function(name) {
    return _db.collection(name.replace('nkby.', '')).find({}).toArray(function(e, result) {
      if (e) {
        return next(e);
      }
      return Writefile('backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify(result, null, '\t')).then(function() {
        return console.log(name + ' backed up');
      });
    });
  };
  _db.collectionNames(function(err, items) {
    var item, o, _results;
    _results = [];
    for (o in items) {
      item = items[o];
      _results.push(_Backup(item.name));
    }
    return _results;
  });
}

DApi(_app);

StaticDataApi(_app);

_app.listen(3000, function() {
  return console.log('Express server listening on port 3000');
});

//# sourceMappingURL=server.js.map
