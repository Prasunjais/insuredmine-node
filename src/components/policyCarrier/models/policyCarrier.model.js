const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const policyCarriers = new Schema({
  companyName: {
    type: String,
    required: true
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
policyCarriers.index({
  'companyName': 1,
  'status': 1
});

policyCarriers.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('policyCarriers', policyCarriers);