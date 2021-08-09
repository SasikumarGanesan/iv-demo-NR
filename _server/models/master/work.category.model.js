const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const softDelete = require('mongoose-delete');
let workCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name can\'t be empty'
  },
  type: {
    type: String,
    required: 'Type can\'t be empty'
  },
  description: String
});

workCategorySchema.plugin(timestamps);
workCategorySchema.plugin(softDelete, { overrideMethods: true });
mongoose.model('WorkCategory', workCategorySchema);
