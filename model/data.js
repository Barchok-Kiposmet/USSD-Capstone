const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  type: {
    required: false,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  amount: {
    required: true,
    type: Number,
  },
  resource: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('data', dataSchema);
