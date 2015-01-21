var fs = require('fs')

function _getJSON(req, res, next) {
    var _path = './data/tree/tree.json';

    fs.readFile(_path, 'utf8', function(err, data) {
        if (err) throw err;
        res.send(JSON.parse(data));
        next();
    });
}

module.exports = _getJSON;