const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const messages = new Schema({
  message: {
    type: String,
    required: true
  },
  day: {
    type: Number
  },
  dayTimeInMins: {
    type: Number,
  },
  insertedAt: {
    type: Date
  },
  status: {
    type: Number,
    default: 1,
    enum: [0, 1]
  },
  isDeleted: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
}, {
  timestamps: true
});

// creating indexes
messages.index({
  'day': 1,
  'dayTimeInMins': 1,
  'status': 1
});

messages.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('messages', messages);