var restify = require('restify'),
    fs = require('fs'),
    path = require('path')

function dirTree(filename) {
    console.log(filename)
    var _ignore = ['.DS_Store'];

    if(_ignore.indexOf(path.basename(filename)) === -1){
	    var stats = fs.lstatSync(filename),
	        info = {
	            path: filename,
	            name: path.basename(filename)
	        };

	    if (stats.isDirectory()) {
	        info.type = "folder";
	        info.children = fs.readdirSync(filename).map(function(child) {
	            return dirTree(filename + '/' + child);
	        });
	    } else {
	        // Assuming it's a file. In real life it could be a symlink or
	        // something else!
	        info.type = "file";
	    }    	
    }

    return info;
}

function read(req, res, next) {
    var _path = './data/www/' + req.params.path.replace('-', '/') + '.html';

    fs.readFile(_path, 'utf8', function(err, data) {
        if (err) throw err;
        res.send(data);
        next();
    });
}

function build(req, res, next) {
    var _dirTree = dirTree('./data/www', false, null);

    fs.writeFile('./data/tree/tree.json', JSON.stringify(_dirTree.children, null, '\t'), function(err) {
        if (err) throw err;
        res.send(_dirTree.children);
    });

    
}

var server = restify.createServer();

server.get('/read/:path', read);
server.get('/build/', build);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});