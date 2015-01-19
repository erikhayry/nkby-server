var restify = require('restify')
    build = require('./services/buildTree.js'),
    readFile = require('./services/readFile.js'),
    path = require('path')

var server = restify.createServer();


server.get('/read/:path', readFile);
server.get('/build/', build);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
  	console.log(result)
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

// Connection URL
//mongod --dbpath=/data --port 27017

var url = 'mongodb://localhost:27017/nkby-server';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    db.close();
  });
});