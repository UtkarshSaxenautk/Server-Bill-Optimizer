const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const HourReportSchema = Schema({
    user_id: {
        type: Types.ObjectId,
        required: true,
    },
    hour: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    suggestedhour: [
        {
            name: {
                type: String,
                required: false,
            },
            id: {
                type: Number,
                required: false,
            },
            time: {
                type: String,
                required: false,
            },
        },
    ],
    suggestedBrands: [
        {
            name: {
                type: String,
                required: false,
            },
            power: {
                type: Number,
                required: false,
            },
            brand: {
                type: String,
                required: false,
            },
        },
    ],
});

const HourReport = mongoose.model('HourReport', HourReportSchema);
module.exports = HourReport;
