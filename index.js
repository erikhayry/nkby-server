var restify = require('restify')
    build = require('./services/buildTree.js'),
    readFile = require('./services/readFile.js'),
    getJSON = require('./services/getJSON.js'),
    path = require('path')

var server = restify.createServer();

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.get('/read/:path', readFile);
server.get('/build/', build);
server.get('/json/', getJSON);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});