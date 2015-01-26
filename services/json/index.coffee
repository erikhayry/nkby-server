Fs = require 'fs'
Q = require 'Q'
Path = require 'path'
_ = require 'lodash-node'
DB = require '../db'
_root = ''

_BuildTree = (rootFolder, folder) ->
    _ignore = ['.ds_store', 'css', 'spacer.gif', 'clearpixel.gif']
    _basename = Path.basename folder

    for toIgnore in _ignore
	    return undefined if folder.toLowerCase().indexOf(toIgnore) > -1  	

    _stats = Fs.lstatSync rootFolder+folder
    _info = 
        path: folder
        
    if _stats.isDirectory()
        _info.children = Fs.readdirSync rootFolder+folder
        	.map (child) ->
            	_BuildTree rootFolder, folder+'/'+child	

        _info.children = _.without _info.children, undefined   	 	 

   	_info

_Get = (path) ->
	_deferred = Q.defer()

	Fs.exists path, (exists) ->
		if not exists
			_deferred.reject('unable to open')
		else
			Fs.readFile path, 'utf8', (err, data) ->
				_deferred.reject() err if err
				_deferred.resolve JSON.parse data        

	_deferred.promise

_Build = (path) ->
	_deferred = Q.defer()
	_dataPath = './data/www/'
	_dirTree = _BuildTree _dataPath, path, false, null
		.children
	
	_json = 
		data: _dirTree
		root: _dataPath

	_jsonPath = './data/tree/' + path.replace(/\//g, '-') + '.json'

	Fs.renameSync(_jsonPath, './data/tree/' + path.replace(/\//g, '-') + new Date().getTime() + '.json') if Fs.existsSync _jsonPath

	Fs.writeFile _jsonPath, JSON.stringify(_json, null, '\t'), (err) ->
		_deferred.reject err if err
		_deferred.resolve _json

	_deferred.promise


_BuildDb = () ->
	arr = []
	_BuildDocument = (node, root) ->
		node.map (n) ->
			_BuildDocument n.children, n.path if n.children
			
			arr.push({
				_id: n.path,
				path: ','+Path.basename(n.path).replace('/', ',')
			})
		
		return


	_Get('./data/tree/sidor.json')
		.then (data) ->
			_BuildDocument data.data, data.root

			console.log arr.length
			Fs.writeFile './tree.json', JSON.stringify(arr, null, '\t')

		, (err) ->
			console.log err			

module.exports = 
	get: _Get
	build: _Build
	buildDb: _BuildDb