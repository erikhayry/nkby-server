var fs = require('fs')

function read(req, res, next) {
    var _path = './data/www/' + req.params.path.replace('-', '/') + '.html';

    fs.readFile(_path, 'utf8', function(err, data) {
        if (err) throw err;
        res.send(data);
        next();
    });
}

module.exports = read;