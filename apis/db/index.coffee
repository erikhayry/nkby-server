Path = require 'path'
Url = require '../../services/url'

module.exports = (app, db) ->


	app.param 'collectionName', (req, res, next, collectionName) ->
		req.collection = db.collection collectionName
		next()

	app.param 'parent', (req, res, next, parent) ->
		req.parent =
			"parent": Path.normalize("/"+Url.encode(parent))
			"trashed": { $ne: true }
		next()

	app.param 'newPath', (req, res, next, newPath) ->
		req.newPath = Path.normalize("/"+Url.encode(newPath))
		next()		

	app.param 'id', (req, res, next, id) ->
		req.id = id
		next()		

	#DB API
	app.get '/', (req, res, next) ->
		res.send 'please select a collection, e.g., /collections/messages'

	#get child nodes	
	app.get '/collections/tree/:parent', (req, res, next) ->
		db.collection('tree').find(
			req.parent, 
			limit: 0, 
			sort: '_id': 1
			)
			.toArray (e, result) ->
				return next e if e
				res.send result

	app.put '/collections/tree/:newPath', (req, res, next) ->		
	   	db.collection('tree').updateById(
	    	req.newPath, 
	    	{$set:req.body}, 
	    	safe: true, multi: false, 
	    	(e, result) ->
	        	return next e if e
	        	res.send result
	       	)	

	app.get '/collections/map/:latitude/:longitude', (req, res, next) ->
		db.collection('map').find(
			{
				latitude: req.params.latitude
				longitude: req.params.longitude
			}, 
			limit: 0, 
			sort: '_id': 1
			)
			.toArray (e, result) ->
				return next e if e
				res.send result

	app.get '/collections/:collectionName', (req, res, next) ->
		req.collection.find {}, limit: 10, sort: '_id': 1
			.toArray (e, result) ->
				return next e if e
				res.send result 

	app.post '/collections/:collectionName', (req, res, next) ->
		req.collection.insert req.body, {}, (e, result) -> 
			return next e if e
			res.send result			

	app.get '/collections/:collectionName/:id', (req, res, next) ->
		req.collection.findById req.id, (e, result) ->
			return next e if e
			res.send result

	app.put '/collections/:collectionName/:id', (req, res, next) ->

	    req.collection.updateById(
	    	req.id, 
	    	req.body, 
	    	safe: true, multi: false, 
	    	(e, result) ->
	        	return next e if e
	        	res.send result
	       	)

	app.delete '/collections/:collectionName/:id', (req, res, next) ->
		req.collection.removeById req.id, (e, result) ->
			return next e if e
			res.send result	

	app
