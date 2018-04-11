var mongoose = require('mongoose');
//var uri = "mongodb://test:test@cluster0-shard-00-00-597iy.mongodb.net:27017,cluster0-shard-00-01-597iy.mongodb.net:27017,cluster0-shard-00-02-597iy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
var uri = "mongodb://pinpong:pingpong@cluster0-shard-00-00-hbaf9.mongodb.net:27017,cluster0-shard-00-01-hbaf9.mongodb.net:27017,cluster0-shard-00-02-hbaf9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

mongoose.connect(uri, function(err, client) {

if(!err) {
    console.log("Database connected successfully");
  } else {
  console.log("Error in establishing connection to database");
}});
