var mongoose = require('mongoose');

var player = new mongoose.Schema({
  first_name: {
   type: String,
   trim: true,
   required: true,
   unique: true
  },
  last_name: {
     type: String,
                trim: true,
                required: true
  },
  rating: {
    type: Number,
   // unique: true,
    lowercase: true,
    trim: true
   // required: true
  },
    handedness: {
    type: String,
    required: true,
    enum: ['left', 'right'] },
   created_by: { type: String }

});
player.virtual('id').get(function() {
  return this._id.toHexString();
});

player.set('toJSON', {
  virtuals: true
});


mongoose.model('Player', player);


module.exports = mongoose.model('Player');
//
