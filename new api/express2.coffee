express = require('express')
mongoskin = require('mongoskin')
bodyParser = require('body-parser')
logger = require('morgan')
fs = require('fs')

app = express()
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: true
app.use logger 'dev'

db = mongoskin.db 'mongodb://@localhost:27017/nkby', safe: true

backup = (name) ->
	db.collection name.replace 'nkby.', ''
			.find {}
			.toArray (e, result) ->
				return next e if e
				fs.writeFileSync 'backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify result, null, '\t'
				console.log 'backupped ' + name

db.collectionNames (err, items) ->	
	backup item.name for o, item of items

app.param 'collectionName', (req, res, next, collectionName) ->
	req.collection = db.collection collectionName
	next()

#API
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

app.listen 3000, ->
    console.log('Express server listening on port 3001')