const mongoose = require('mongoose');

const CarProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add car provider name']
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    telephone_number: {
        type: String,
        required: [true, 'Please add a telephone number in form of XXX-XXXXXXX'],
        match: [/^\d{3}-\d{7}$/,'Please add a valid telephone number']
    }
});

module.exports = mongoose.model('Car_Provider', CarProviderSchema);