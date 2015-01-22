var Fs, Path, Q, _, _Build, _BuildTree, _Get, _root;

Fs = require('fs');

Q = require('Q');

Path = require('path');

_ = require('lodash-node');

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
      return _deferred.reject();
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

_Build = function(path) {
  var _dataPath, _deferred, _dirTree, _json, _jsonPath;
  _deferred = Q.defer();
  _dataPath = './data/www/';
  _dirTree = _BuildTree(_dataPath, path, false, null).children;
  _json = {
    data: _dirTree,
    root: _dataPath
  };
  _jsonPath = './data/tree/' + path.replace(/\//g, '-') + '.json';
  if (Fs.existsSync(_jsonPath)) {
    Fs.renameSync(_jsonPath, './data/tree/' + path.replace(/\//g, '-') + new Date().getTime() + '.json');
  }
  Fs.writeFile(_jsonPath, JSON.stringify(_json, null, '\t'), function(err) {
    if (err) {
      _deferred.reject(err);
    }
    return _deferred.resolve(_json);
  });
  return _deferred.promise;
};

module.exports = {
  get: _Get,
  build: _Build
};

//# sourceMappingURL=index.js.map
