Express = require 'express'
Mongoskin = require 'mongoskin'
BodyParser = require 'body-parser'
Logger = require 'morgan'
Writefile = require 'writefile'
Cors = require 'cors'

DApi = require './apis/db'
StaticDataApi = require './apis/static-data'

_app = Express()
_app.use Cors()
_app.use BodyParser.json()
_app.use BodyParser.urlencoded extended: true
_app.use Logger 'dev'	

_db = Mongoskin.db 'mongodb://@localhost:27017/nkby', safe: true

unless process.argv[2] is '-ignore'
	_Backup = (name) ->
		_db.collection name.replace 'nkby.', ''
				.find {}
				.toArray (e, result) ->
					return next e if e
					Writefile 'backup/' + new Date().getTime() + '_' + name + '.json', JSON.stringify result, null, '\t'
						.then -> console.log name + ' backed up'

	_db.collectionNames (err, items) ->	
		_Backup item.name for o, item of items

#Add APIs
DApi _app
StaticDataApi _app

_app.listen 3000, ->
    console.log('Express server listening on port 3000')