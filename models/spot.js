const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spotSchema = new Schema({
    title: {
        type: String
    },
    location: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

module.exports = mongoose.model('Spot', spotSchema);