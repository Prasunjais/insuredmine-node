const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const policyCategorys = new Schema({
  categoryName: {
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
policyCategorys.index({
  'categoryName': 1,
  'status': 1
});

policyCategorys.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('policyCategorys', policyCategorys);