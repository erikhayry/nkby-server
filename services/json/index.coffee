Fs = require 'fs'
Q = require 'Q'
Path = require 'path'
_ = require 'lodash-node'

_BuildTree = (folder) ->
    _ignore = ['.DS_Store']
    _basename = Path.basename folder

    return undefined if _ignore.indexOf(_basename) > -1

    _stats = Fs.lstatSync folder
    _info = 
        path: folder
        name: _basename
        

    if _stats.isDirectory()
        _info.type = "folder"
        _info.children = Fs.readdirSync folder
        	.map (child) ->
            	_BuildTree folder+'/'+child	

        _info.children = _.without _info.children, undefined   	 	 

    else
        _info.type = "file";	

   	_info

_Get = (path) ->
	_deferred = Q.defer()

	Fs.exists path, (exists) ->
		if not exists
			_deferred.reject()
		else
			Fs.readFile path, 'utf8', (err, data) ->
				_deferred.reject() err if err
				_deferred.resolve JSON.parse data        

	_deferred.promise

_Build = (path) ->
	_deferred = Q.defer()
	_dirTree = _BuildTree path, false, null
		.children
	_jsonPath = './data/tree/tree.json'

	Fs.renameSync(_jsonPath, './data/tree/tree-' + new Date().getTime() + '.json') if Fs.existsSync _jsonPath

	Fs.writeFile _jsonPath, JSON.stringify(_dirTree, null, '\t'), (err) ->
		_deferred.reject err if err
		_deferred.resolve _dirTree

	_deferred.promise

module.exports = 
	get: _Get
	build: _Build