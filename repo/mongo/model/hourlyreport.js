const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const HourlyReportSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
  },
  usage: {
    power: {
      type: Number,
      required: true,
    },
    limit: {
      type: Boolean,
      required: true,
    },
  },
  timeSent: {
    type: Date,
    required: false,
  },
});

const Hourly = mongoose.model('Hourly', HourlyReportSchema);
module.exports = Hourly;
