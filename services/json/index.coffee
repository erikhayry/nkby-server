fs = require 'fs'
Q = require 'Q'
path = require 'path'
_ = require 'lodash-node'

_buildTree = (folder) ->
    _ignore = ['.DS_Store']
    _basename = path.basename folder

    return undefined if _ignore.indexOf(_basename) > -1

    _stats = fs.lstatSync folder
    _info = 
        path: folder
        name: _basename
        

    if _stats.isDirectory()
        _info.type = "folder"
        _info.children = fs.readdirSync folder
        	.map (child) ->
            	_buildTree folder+'/'+child	

        _info.children = _.without _info.children, undefined   	 	 

    else
        _info.type = "file";	

   	_info

_get = (path) ->
	_deferred = Q.defer()

	fs.exists path, (exists) ->
		if not exists
			_deferred.reject()
		else
			fs.readFile path, 'utf8', (err, data) ->
				_deferred.reject() err if err
				_deferred.resolve JSON.parse data        

	_deferred.promise

_build = (path) ->
	_deferred = Q.defer()
	_dirTree = _buildTree path, false, null
		.children
	_jsonPath = './data/tree/tree.json'

	fs.renameSync(_jsonPath, './data/tree/tree-' + new Date().getTime() + '.json') if fs.existsSync _jsonPath

	fs.writeFile _jsonPath, JSON.stringify(_dirTree, null, '\t'), (err) ->
		_deferred.reject err if err
		_deferred.resolve _dirTree

	_deferred.promise

module.exports = 
	get: _get
	build: _build