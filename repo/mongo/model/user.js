const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const UserSchema = new Schema({
    _id: {
        type: Types.ObjectId,
         default: Types.ObjectId,
    },
    user_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    total: {
        type: Number,
        required: false,
    },
    appliances: [
        {
            appliance_id: {
                type: Types.ObjectId,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            brand: {
                type: String,
                required: false,
            },
            power: {
                type: Number,
                required: false,
            },
            expectedhour: {
                type: Number,
                required: false,
            },
            location: {
                type: String,
                required: false,
            },
        },
    ],
    bill: {
        type: Number,
        required: false,
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
