const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const user = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  gender: {
    type: String,
    default: 'male',
    lowercase: true,
    enum: ['male', 'female', 'transgender', '']
  },
  userType: {
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
user.index({
  'name': 1,
  'status': 1
});

user.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('user', user);