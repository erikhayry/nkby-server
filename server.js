var app, backup, bodyParser, db, dbApi, express, logger, mongoskin, staticDataApi, writefile;

express = require('express');

mongoskin = require('mongoskin');

bodyParser = require('body-parser');

logger = require('morgan');

writefile = require('writefile');

dbApi = require('./apis/db');

staticDataApi = require('./apis/static-data');

app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('dev'));

db = mongoskin.db('mongodb://@localhost:27017/nkby', {
  safe: true
});

if (process.argv[2] !== '-ignore') {
  backup = function(name) {
    return db.collection(name.replace('nkby.', '')).find({}).toArray(function(e, result) {
      if (e) {
        return next(e);
      }
      return writefile('backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify(result, null, '\t')).then(function() {
        return console.log(name + ' backed up');
      });
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
}

dbApi(app);

staticDataApi(app);

app.listen(3000, function() {
  return console.log('Express server listening on port 3000');
});

//# sourceMappingURL=server.js.map
