module.exports = (app) ->
	app.param 'collectionName', (req, res, next, collectionName) ->
		req.collection = db.collection collectionName
		next()

	#DB API
	app.get '/', (req, res, next) ->
		res.send 'please select a collection, e.g., /collections/messages'

	app.get '/collections/:collectionName', (req, res, next) ->
		req.collection.find {}, limit: 10, sort: '_id': -1
			.toArray (e, result) ->
				return next e if e
				res.send result

	app.post '/collections/:collectionName', (req, res, next) ->
		req.collection.insert req.body, {}, (e, result) -> 
			return next e if e
			res.send result			

	app.get '/collections/:collectionName/:id', (req, res, next) ->
		req.collection.findById req.params.id, (e, result) ->
			return next e if e
			res.send result

	app.put '/collections/:collectionName/:id', (req, res, next) ->
	    req.collection.updateById req.params.id, 
	    	{$set: req.body}, 
	    	safe: true, multi: false, 
	    	(e, result) ->
	        	return next e if e
	        	res.send if result == 1 then msg: 'success' else msg: 'error'    

	app.delete '/collections/:collectionName/:id', (req, res, next) ->
		req.collection.removeById req.params.id, (e, result) ->
			return next e if e
			res.send if result == 1 then msg: 'success' else msg: 'error'	

	app
