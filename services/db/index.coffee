Mongoskin = require 'mongoskin'
DB = Mongoskin.db 'mongodb://@localhost:27017/nkby', safe: true
Q = require 'Q'


_get = (collectionName) ->
	Q(resolve, reject) ->
		collection  = DB.collection collectionName

		collection.find {}, limit: 10, sort: '_id': -1
			.toArray (e, result) ->
				reject e if e
				resolve result

_post = (collectionName, data) ->
	deferred = Q.defer()

	collection  = DB.collection collectionName
	collection.insert data, {}, (e, result) -> 
		deferred.reject e if e
		deferred.resolve data
		return	

	deferred.promise;		

_postBulk = (collectionName, data) ->
	Q(resolve, reject) ->
		collection = DB.collection collectionName
		bulk = collectionName.initializeUnorderedBulkOp()

		bulk.insert data, {}, (e, result) -> 
			reject e if e
			resolve bulk		


_getById = (collectionName, id) ->
	collection  = DB.collection collectionName

	collection.findById id, (e, result) ->
		#return next e if e
		result

_put = (collectionName, id, data) ->
    collection.updateById id, 
    	{$set: data}, 
    	safe: true, multi: false, 
    	(e, result) ->
        	#return next e if e
        	result if result == 1 then msg: 'success' else msg: 'error'    

_delete = (collectionName, id) ->
	collection.removeById id, (e, result) ->
		#return next e if e
		result if result == 1 then msg: 'success' else msg: 'error'	



module.exports = 
	get: _get
	post: _post
	post: _post
	getById: _getById
	put: _put
	delete: _delete
	
