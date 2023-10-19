const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Spot = require('../models/spot');

mongoose.connect('mongodb://localhost:27017/discover-rajkot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Spot.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Spot({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            images: [
                {
                    filename: 'Discover-Rajkot/w49nqfcksksx8jhwb4wh',
                    url: 'https://res.cloudinary.com/dyw13siqk/image/upload/v1697712875/Discover-Rajkot/kfpxo1ijpgxwd0mezzbc.jpg'
                }
            ],
            description: 'Lorem ipsum dolor sit amet cons',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '65301b465d04525fd01924f1'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('Database reset and closing connection')
    mongoose.connection.close();
})