
var jwt = require('jsonwebtoken');
var User = require('../../src/models/user');

var authUser = async function(authorization) {
    var token = authorization.split('Bearer ')[1];

    var user = jwt.decode(authorization.slice(7));
    let userEmail = null;
     if (user != null) {
      userEmail = user.email;

     }
     return await User.findOne({ email: userEmail }).exec();
}

exports.authUser = authUser;
