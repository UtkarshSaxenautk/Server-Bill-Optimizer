const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ShowApplianceSchema = new Schema({
    _id: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    powerconsumption: {
        type: Number,
        required: true,
    },
});

const ShowAppliance = mongoose.model('ShowAppliance', ShowApplianceSchema);
module.exports = ShowAppliance;
