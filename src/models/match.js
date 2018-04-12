var mongoose = require('mongoose');

var match = new mongoose.Schema({
 firstPlayer: {
   type: String,
   required: true
 },
 firstPlayerScore: {
    type: Number,
    required: true
  },
 secondPlayer: {
    type: String,
    required: true
  },
 secondPlayerScore: {
      type: Number,
      required: true
    },
 matchwinner:{
    type: String,
    required: true
 },
 createdBy: {
    type: String,
    required: true
 }
});
match.virtual('id').get(function() {
  return this._id.toHexString();
});

match.set('toJSON', {
  virtuals: true
});


mongoose.model('Match', match);


module.exports = mongoose.model('Match');
//
