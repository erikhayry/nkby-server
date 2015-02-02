var DB, Fs, Path, Q, _, _Build, _BuildDb, _BuildTree, _Get, _root;

Fs = require('fs');

Q = require('Q');

Path = require('path');

_ = require('lodash-node');

DB = require('../db');

_root = '';

_BuildTree = function(rootFolder, folder) {
  var toIgnore, _basename, _i, _ignore, _info, _len, _stats;
  _ignore = ['.ds_store', 'css', 'spacer.gif', 'clearpixel.gif'];
  _basename = Path.basename(folder);
  for (_i = 0, _len = _ignore.length; _i < _len; _i++) {
    toIgnore = _ignore[_i];
    if (folder.toLowerCase().indexOf(toIgnore) > -1) {
      return void 0;
    }
  }
  _stats = Fs.lstatSync(rootFolder + folder);
  _info = {
    path: folder
  };
  if (_stats.isDirectory()) {
    _info.children = Fs.readdirSync(rootFolder + folder).map(function(child) {
      return _BuildTree(rootFolder, folder + '/' + child);
    });
    _info.children = _.without(_info.children, void 0);
  }
  return _info;
};

_Get = function(path) {
  var _deferred;
  _deferred = Q.defer();
  Fs.exists(path, function(exists) {
    if (!exists) {
      return _deferred.reject('unable to open');
    } else {
      return Fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          _deferred.reject()(err);
        }
        return _deferred.resolve(JSON.parse(data));
      });
    }
  });
  return _deferred.promise;
};

_Build = function(data) {
  var _deferred;
  _deferred = Q.defer();
  Fs.writeFile('./map.json', JSON.stringify(data, null, '\t'), function(err) {
    if (err) {
      _deferred.reject(err);
    }
    return _deferred.resolve('./map.json');
  });
  return _deferred.promise;
};

_BuildDb = function() {
  var arr, _BuildDocument;
  arr = [];
  _BuildDocument = function(node, root) {
    node.map(function(n) {
      if (n.children) {
        _BuildDocument(n.children, n.path);
      }
      return arr.push({
        _id: n.path,
        parent: Path.dirname(n.path),
        base: Path.basename(n.path)
      });
    });
  };
  return _Get('./data/tree/www.json').then(function(data) {
    _BuildDocument(data.data, data.root);
    console.log(arr.length);
    return Fs.writeFile('./data/tree/db_www.json', JSON.stringify(arr, null, '\t'));
  }, function(err) {
    return console.log(err);
  });
};

module.exports = {
  get: _Get,
  build: _Build,
  buildDb: _BuildDb
};

//# sourceMappingURL=index.js.map
