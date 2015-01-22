express = require 'express'
mongoskin = require 'mongoskin'
bodyParser = require 'body-parser'
logger = require 'morgan'
writefile = require 'writefile'

dbApi = require './apis/db'
staticDataApi = require './apis/static-data'

app = express()
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: true
app.use logger 'dev'

db = mongoskin.db 'mongodb://@localhost:27017/nkby', safe: true

unless process.argv[2] is '-ignore'
	backup = (name) ->
		db.collection name.replace 'nkby.', ''
				.find {}
				.toArray (e, result) ->
					return next e if e
					writefile 'backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify result, null, '\t'
						.then -> console.log name + ' backed up'

	db.collectionNames (err, items) ->	
		backup item.name for o, item of items

#Add APIs
dbApi(app)
staticDataApi(app)

app.listen 3000, ->
    console.log('Express server listening on port 3000')