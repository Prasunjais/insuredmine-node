const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const userAccounts = new Schema({
  accountName: {
    type: String
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
userAccounts.index({
  'accountName': 1,
  'status': 1
});

userAccounts.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('userAccounts', userAccounts);