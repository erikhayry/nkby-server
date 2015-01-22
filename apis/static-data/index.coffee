Html = require '../../services/html'
Json = require '../../services/json'

module.exports = (app) ->
	app.param 'path', (req, res, next, path) ->
		req.newpath = path.replace(/-/g, '/')
		next()

	app.get '/static/json/:path', (req, res, next) -> 
		Json.get req.newpath+'.json'
			.then (data) ->
				res.send data
			,	(err) ->
				res.send 'unable to get json for ' + req.newpath

	app.get '/static/html/:path', (req, res, next) ->
		Html.get req.newpath+'.html'
			.then (data) ->
				res.send data
			,	(err) ->
				res.send 'unable to get html data for ' + req.newpath
	app
