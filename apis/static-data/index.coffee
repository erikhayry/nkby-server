Html = require '../../services/html'
Json = require '../../services/json'

urlencode  = (str) ->
    str.replace(/&046/g, ".").replace(/&047/g, "/")

module.exports = (app) ->
	app.param 'path', (req, res, next, path) ->
		req.newpath = urlencode path
		console.log req.newpath
		next()

	app.get '/static/json/:path', (req, res, next) -> 
		Json.get req.newpath
			.then (data) ->
				res.send data
			,	(err) ->
				res.send 'unable to get json for ' + req.newpath

	app.get '/static/html/:path', (req, res, next) ->
		Html.get req.newpath
			.then (data) ->
				res.send data
			,	(err) ->
				res.send 'unable to get html data for ' + req.newpath
	app
