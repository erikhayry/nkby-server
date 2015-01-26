var DB, Mongoskin, Q, _delete, _get, _getById, _post, _postBulk, _put;

Mongoskin = require('mongoskin');

DB = Mongoskin.db('mongodb://@localhost:27017/nkby', {
  safe: true
});

Q = require('Q');

_get = function(collectionName) {
  return Q(resolve, reject)(function() {
    var collection;
    collection = DB.collection(collectionName);
    return collection.find({}, {
      limit: 10,
      sort: {
        '_id': -1
      }
    }).toArray(function(e, result) {
      if (e) {
        reject(e);
      }
      return resolve(result);
    });
  });
};

_post = function(collectionName, data) {
  var collection, deferred;
  deferred = Q.defer();
  collection = DB.collection(collectionName);
  collection.insert(data, {}, function(e, result) {
    if (e) {
      deferred.reject(e);
    }
    deferred.resolve(data);
  });
  return deferred.promise;
};

_postBulk = function(collectionName, data) {
  return Q(resolve, reject)(function() {
    var bulk, collection;
    collection = DB.collection(collectionName);
    bulk = collectionName.initializeUnorderedBulkOp();
    return bulk.insert(data, {}, function(e, result) {
      if (e) {
        reject(e);
      }
      return resolve(bulk);
    });
  });
};

_getById = function(collectionName, id) {
  var collection;
  collection = DB.collection(collectionName);
  return collection.findById(id, function(e, result) {
    return result;
  });
};

_put = function(collectionName, id, data) {
  return collection.updateById(id, {
    $set: data
  }, {
    safe: true,
    multi: false
  }, function(e, result) {
    return result(result === 1 ? {
      msg: 'success'
    } : {
      msg: 'error'
    });
  });
};

_delete = function(collectionName, id) {
  return collection.removeById(id, function(e, result) {
    return result(result === 1 ? {
      msg: 'success'
    } : {
      msg: 'error'
    });
  });
};

module.exports = {
  get: _get,
  post: _post,
  post: _post,
  getById: _getById,
  put: _put,
  "delete": _delete
};

//# sourceMappingURL=index.js.map
