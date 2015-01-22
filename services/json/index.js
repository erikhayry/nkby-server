var Q, fs, path, _, _build, _buildTree, _get;

fs = require('fs');

Q = require('Q');

path = require('path');

_ = require('lodash-node');

_buildTree = function(folder) {
  var _basename, _ignore, _info, _stats;
  _ignore = ['.DS_Store'];
  _basename = path.basename(folder);
  if (_ignore.indexOf(_basename) > -1) {
    return void 0;
  }
  _stats = fs.lstatSync(folder);
  _info = {
    path: folder,
    name: _basename
  };
  if (_stats.isDirectory()) {
    _info.type = "folder";
    _info.children = fs.readdirSync(folder).map(function(child) {
      return _buildTree(folder + '/' + child);
    });
    _info.children = _.without(_info.children, void 0);
  } else {
    _info.type = "file";
  }
  return _info;
};

_get = function(path) {
  var _deferred;
  _deferred = Q.defer();
  fs.exists(path, function(exists) {
    if (!exists) {
      return _deferred.reject();
    } else {
      return fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          _deferred.reject()(err);
        }
        return _deferred.resolve(JSON.parse(data));
      });
    }
  });
  return _deferred.promise;
};

_build = function(path) {
  var _deferred, _dirTree, _jsonPath;
  _deferred = Q.defer();
  _dirTree = _buildTree(path, false, null).children;
  _jsonPath = './data/tree/tree.json';
  if (fs.existsSync(_jsonPath)) {
    fs.renameSync(_jsonPath, './data/tree/tree-' + new Date().getTime() + '.json');
  }
  fs.writeFile(_jsonPath, JSON.stringify(_dirTree, null, '\t'), function(err) {
    if (err) {
      _deferred.reject(err);
    }
    return _deferred.resolve(_dirTree);
  });
  return _deferred.promise;
};

module.exports = {
  get: _get,
  build: _build
};

//# sourceMappingURL=index.js.map
