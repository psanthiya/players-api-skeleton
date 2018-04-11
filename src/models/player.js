var mongoose = require('mongoose');

var player = new mongoose.Schema({
  firstname: {
   type: String,
   trim: true,
   required: true
  },
  lastname: String,
  rating: {
    type: String,
   // unique: true,
    lowercase: true,
    trim: true
   // required: true
  },
  handedness: {
   type: String
   }
});


mongoose.model('Player', player);


module.exports = mongoose.model('Player');
//
