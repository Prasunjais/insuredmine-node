const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const agents = new Schema({
  name: {
    type: String,
    required: true
  },
  nameToDisplay: {
    type: String,
    required: true,
    unique: true
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
agents.index({
  'name': 1,
  'status': 1
});

agents.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('agents', agents);