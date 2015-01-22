var Fs, Path, Q, _, _Build, _BuildTree, _Get;

Fs = require('fs');

Q = require('Q');

Path = require('path');

_ = require('lodash-node');

_BuildTree = function(folder) {
  var _basename, _ignore, _info, _stats;
  _ignore = ['.DS_Store'];
  _basename = Path.basename(folder);
  if (_ignore.indexOf(_basename) > -1) {
    return void 0;
  }
  _stats = Fs.lstatSync(folder);
  _info = {
    path: folder,
    name: _basename
  };
  if (_stats.isDirectory()) {
    _info.type = "folder";
    _info.children = Fs.readdirSync(folder).map(function(child) {
      return _BuildTree(folder + '/' + child);
    });
    _info.children = _.without(_info.children, void 0);
  } else {
    _info.type = "file";
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
  var _deferred, _dirTree, _jsonPath;
  _deferred = Q.defer();
  _dirTree = _BuildTree(path, false, null).children;
  _jsonPath = './data/tree/tree.json';
  if (Fs.existsSync(_jsonPath)) {
    Fs.renameSync(_jsonPath, './data/tree/tree-' + new Date().getTime() + '.json');
  }
  Fs.writeFile(_jsonPath, JSON.stringify(_dirTree, null, '\t'), function(err) {
    if (err) {
      _deferred.reject(err);
    }
    return _deferred.resolve(_dirTree);
  });
  return _deferred.promise;
};

module.exports = {
  get: _Get,
  build: _Build
};

//# sourceMappingURL=index.js.map
