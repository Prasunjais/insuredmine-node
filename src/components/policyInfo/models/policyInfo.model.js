const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const policyInfo = new Schema({
  policyNumber: {
    type: String,
  },
  policyStartDate: {
    type: Date
  },
  policyEndDate: {
    type: Date
  },
  premiumAmountWritten: {
    type: Number
  },
  premiumAmount: {
    type: Number
  },
  policyType: {
    type: String
  },
  policyCategory: {
    type: String
  },
  collectionId: {
    type: String
  },
  companyCollectionId: {
    type: String
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agents'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'policycategorys'
  },
  carrierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'policycarriers'
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
policyInfo.index({
  'name': 1,
  'status': 1
});

policyInfo.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('policyInfo', policyInfo);