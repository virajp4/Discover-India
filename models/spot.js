const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spotSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: String,
        default: 'Free'
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
});

module.exports = mongoose.model('Spot', spotSchema);