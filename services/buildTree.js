var fs = require('fs'),
    tree = require('./tree.js');

function build(req, res, next) {
    var _dirTree = tree('./data/www/sidor', false, null).children,
    	_jsonPath = './data/tree/tree.json';	
    	_exists = fs.existsSync(_jsonPath);

    if(_exists){
    	fs.renameSync(_jsonPath, './data/tree/tree-' + new Date().getTime() + '.json');
    }

    fs.writeFile(_jsonPath, JSON.stringify(_dirTree, null, '\t'), function(err) {
        if (err) throw err;
        res.send(_dirTree);
    });
}

module.exports = build;