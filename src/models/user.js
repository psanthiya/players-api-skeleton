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
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String
  }
});


user.virtual('id').get(function () {
  return this._id.toHexString();
});
user.set('toJSON', {
  virtuals: true
});


mongoose.model('User', user);

module.exports = mongoose.model('User');
