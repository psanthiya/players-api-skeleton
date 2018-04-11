var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var user = new mongoose.Schema({
  first_name: {
   type: String,
   trim: true,
   required: true
  },
  last_name: String,
  email: {
    type: String,
   // unique: true,
    lowercase: true,
    trim: true
   // required: true
  },
  hash_password: {
   type: String
   }
});

user.methods.comparePassword = function(password) {
console.log(password + this.hash_password);
  return bcrypt.compareSync(password, this.hash_password);
};

/*user.methods.comparePassword = function(password) {
//bcrypt.compare(password, this.password, function(err, isMatch) {

console.log("Password "+ password);
console.log("Password "+ this.password);
*//*if (err) {
      return cb(err, false);
    }
    return cb(null, isMatch);*//*
 *//*return new Promise(function(resolve,reject)
     {
         bcrypt.compare(password, user.password, function (err, isMatch) {
             // Prevent conflict btween err and isMatch
             if (err)
                 reject(new Error("Error checking use password"));
             else
                 console.log(isMatch === true ? 'passwords match' : 'passwords dont match');
                 return;
                 resolve(isMatch);
         });
     });*//*
};*/
mongoose.model('User', user);

module.exports = mongoose.model('User');
